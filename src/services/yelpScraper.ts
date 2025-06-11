import axios from 'axios';
import * as cheerio from 'cheerio';
import { ReviewData, DataSource } from '@/types';

interface YelpBusinessData {
  name: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  cuisine: string[];
  address: string;
  phone?: string;
  website?: string;
  hours?: string[];
  photos?: string[];
  features?: string[];
  reviews: ReviewData[];
}

class YelpScraperService {
  private userAgent = 'Mozilla/5.0 (compatible; ProspectPulse/1.0; +https://storehub.com)';

  async searchYelpBusiness(businessName: string, location?: string): Promise<{
    data: YelpBusinessData | null;
    source: DataSource;
  }> {
    try {
      // First, search for the business on Yelp using Serper API
      const yelpUrl = await this.findYelpUrl(businessName, location);
      
      if (!yelpUrl) {
        return {
          data: null,
          source: {
            type: 'reviews',
            url: 'https://yelp.com',
            timestamp: new Date(),
            confidence: 0,
            dataPoints: 0,
          },
        };
      }

      // Scrape the Yelp page
      const businessData = await this.scrapeYelpPage(yelpUrl);

      return {
        data: businessData,
        source: {
          type: 'reviews',
          url: yelpUrl,
          timestamp: new Date(),
          confidence: businessData ? 0.85 : 0,
          dataPoints: businessData ? businessData.reviews.length + 10 : 0,
        },
      };
    } catch (error) {
      console.error('Yelp search error:', error);
      return {
        data: null,
        source: {
          type: 'reviews',
          url: 'https://yelp.com',
          timestamp: new Date(),
          confidence: 0,
          dataPoints: 0,
        },
      };
    }
  }

  private async findYelpUrl(businessName: string, location?: string): Promise<string | null> {
    try {
      const serperApiKey = process.env.SERPER_API_KEY;
      if (!serperApiKey) {
        console.warn('SERPER_API_KEY not configured - Yelp search limited');
        return null;
      }

      const searchQuery = location 
        ? `site:yelp.com "${businessName}" "${location}"`
        : `site:yelp.com "${businessName}" restaurant`;

      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: searchQuery,
          num: 3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Yelp search failed: ${response.status}`);
      }

      const data = await response.json();
      const results = data.organic || [];

      if (results.length > 0) {
        // Find the most relevant Yelp business page
        for (const result of results) {
          if (result.link.includes('yelp.com/biz/') && 
              !result.link.includes('/photos') && 
              !result.link.includes('/reviews')) {
            return result.link;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Yelp URL search error:', error);
      return null;
    }
  }

  private async scrapeYelpPage(url: string): Promise<YelpBusinessData | null> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        timeout: 15000,
      });

      const $ = cheerio.load(response.data);
      
      // Extract business information
      const name = this.extractBusinessName($);
      const rating = this.extractRating($);
      const reviewCount = this.extractReviewCount($);
      const priceRange = this.extractPriceRange($);
      const cuisine = this.extractCuisine($);
      const address = this.extractAddress($);
      const phone = this.extractPhone($);
      const website = this.extractWebsite($);
      const hours = this.extractHours($);
      const features = this.extractFeatures($);
      const reviews = this.extractReviews($);

      if (!name) {
        return null;
      }

      return {
        name,
        rating,
        reviewCount,
        priceRange,
        cuisine,
        address,
        phone,
        website,
        hours,
        features,
        reviews,
      };
    } catch (error) {
      console.error(`Error scraping Yelp page ${url}:`, error);
      return null;
    }
  }

  private extractBusinessName($: cheerio.CheerioAPI): string {
    // Try multiple selectors for business name
    const selectors = [
      'h1[data-testid="business-name"]',
      'h1.css-1se8maq',
      'h1',
      '.biz-page-title',
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        return element.text().trim();
      }
    }

    return '';
  }

  private extractRating($: cheerio.CheerioAPI): number {
    // Look for rating information
    const ratingSelectors = [
      '[data-testid="rating"] [aria-label*="star"]',
      '.i-stars',
      '[aria-label*="star rating"]',
    ];

    for (const selector of ratingSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const ariaLabel = element.attr('aria-label') || '';
        const ratingMatch = ariaLabel.match(/(\d+(?:\.\d+)?)\s*star/i);
        if (ratingMatch) {
          return parseFloat(ratingMatch[1]);
        }
      }
    }

    return 0;
  }

  private extractReviewCount($: cheerio.CheerioAPI): number {
    const reviewSelectors = [
      '[data-testid="review-count"]',
      '.review-count',
      'span:contains("reviews")',
    ];

    for (const selector of reviewSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text();
        const countMatch = text.match(/(\d+(?:,\d+)*)/);
        if (countMatch) {
          return parseInt(countMatch[1].replace(/,/g, ''));
        }
      }
    }

    return 0;
  }

  private extractPriceRange($: cheerio.CheerioAPI): string {
    const priceSelectors = [
      '[data-testid="price-range"]',
      '.price-range',
      'span:contains("$")',
    ];

    for (const selector of priceSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text().trim();
        if (/^\$+$/.test(text)) {
          return text;
        }
      }
    }

    return '';
  }

  private extractCuisine($: cheerio.CheerioAPI): string[] {
    const cuisineSelectors = [
      '[data-testid="business-categories"] a',
      '.category-str-list a',
      '.biz-page-header .category-str-list',
    ];

    const cuisines: string[] = [];

    for (const selector of cuisineSelectors) {
      $(selector).each((_, element) => {
        const text = $(element).text().trim();
        if (text && !cuisines.includes(text)) {
          cuisines.push(text);
        }
      });
      
      if (cuisines.length > 0) break;
    }

    return cuisines;
  }

  private extractAddress($: cheerio.CheerioAPI): string {
    const addressSelectors = [
      '[data-testid="business-address"]',
      '.street-address',
      '.biz-page-header .street-address',
    ];

    for (const selector of addressSelectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        return element.text().trim();
      }
    }

    return '';
  }

  private extractPhone($: cheerio.CheerioAPI): string | undefined {
    const phoneSelectors = [
      '[data-testid="business-phone"]',
      '.biz-phone',
      'a[href^="tel:"]',
    ];

    for (const selector of phoneSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text().trim();
        if (text) {
          return text;
        }
      }
    }

    return undefined;
  }

  private extractWebsite($: cheerio.CheerioAPI): string | undefined {
    const websiteSelectors = [
      '[data-testid="business-website"] a',
      '.biz-website a',
      'a:contains("website")',
    ];

    for (const selector of websiteSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const href = element.attr('href');
        if (href && !href.includes('yelp.com')) {
          return href;
        }
      }
    }

    return undefined;
  }

  private extractHours($: cheerio.CheerioAPI): string[] {
    const hours: string[] = [];
    
    $('[data-testid="business-hours"] tr, .hours-table tr').each((_, element) => {
      const dayElement = $(element).find('td:first-child, th:first-child');
      const timeElement = $(element).find('td:last-child, td:nth-child(2)');
      
      if (dayElement.length && timeElement.length) {
        const day = dayElement.text().trim();
        const time = timeElement.text().trim();
        if (day && time) {
          hours.push(`${day}: ${time}`);
        }
      }
    });

    return hours;
  }

  private extractFeatures($: cheerio.CheerioAPI): string[] {
    const features: string[] = [];
    
    // Look for amenities and features
    $('[data-testid="amenities"] span, .amenity-text, .feature-item').each((_, element) => {
      const text = $(element).text().trim();
      if (text && !features.includes(text)) {
        features.push(text);
      }
    });

    return features;
  }

  private extractReviews($: cheerio.CheerioAPI): ReviewData[] {
    const reviews: ReviewData[] = [];
    
    $('[data-testid="review"], .review, .review-content').each((_, element) => {
      const reviewElement = $(element);
      
      // Extract rating
      const ratingElement = reviewElement.find('[aria-label*="star"], .i-stars').first();
      let rating = 0;
      if (ratingElement.length) {
        const ariaLabel = ratingElement.attr('aria-label') || '';
        const ratingMatch = ariaLabel.match(/(\d+)\s*star/i);
        if (ratingMatch) {
          rating = parseInt(ratingMatch[1]);
        }
      }

      // Extract review text
      const textElement = reviewElement.find('.review-text, .comment, p').first();
      const text = textElement.text().trim();

      // Extract date
      const dateElement = reviewElement.find('.review-date, .date, time').first();
      const date = dateElement.text().trim() || new Date().toISOString();

      // Extract author
      const authorElement = reviewElement.find('.user-name, .reviewer-name, .author').first();
      const author = authorElement.text().trim();

      if (text && rating > 0) {
        reviews.push({
          source: 'Yelp',
          rating,
          text,
          date,
          author: author || 'Anonymous',
        });
      }
    });

    return reviews.slice(0, 10); // Limit to 10 reviews
  }
}

export const yelpScraperService = new YelpScraperService();
