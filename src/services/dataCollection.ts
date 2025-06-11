import { DataSource, MenuData, ReviewData, NewsData, SocialMediaData } from '@/types';
import { menuParserService } from './menuParser';
import { reviewAnalysisService } from './reviewAnalysis';
import { freeDataSourcesService } from './freeDataSources';
import { googleNewsService } from './googleNews';
import axios from 'axios';

interface SerperSearchResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

interface SerperResponse {
  organic: SerperSearchResult[];
  answerBox?: {
    answer: string;
    title: string;
    link: string;
  };
}

interface ComprehensiveData {
  basicInfo: any;
  businessData?: any;
  menuData?: MenuData;
  reviewsData?: ReviewData[];
  newsData?: NewsData[];
  socialData?: SocialMediaData[];
  sources: DataSource[];
}

class DataCollectionService {
  private serperApiKey: string;

  constructor() {
    this.serperApiKey = process.env.SERPER_API_KEY || '';
    if (!this.serperApiKey) {
      console.warn('SERPER_API_KEY not configured - search functionality will be limited');
    }
  }

  // Enhanced comprehensive search method
  async searchCompanyInfoComprehensive(query: string, location?: string): Promise<{
    data: ComprehensiveData;
    sources: DataSource[];
  }> {
    const allSources: DataSource[] = [];

    try {
      // 1. Basic web search (existing functionality)
      const basicSearch = await this.searchCompanyInfo(query);
      const basicInfo = basicSearch.data;
      allSources.push(...basicSearch.sources);

      // 2. Free business data collection (HIGH PRIORITY)
      let businessData: any;
      try {
        const businessResult = await freeDataSourcesService.collectBusinessData(query, location);
        if (businessResult.data) {
          businessData = businessResult.data;
          allSources.push(...businessResult.sources);
        }
      } catch (error) {
        console.warn('Free business data collection failed:', error);
      }

      // 3. Website menu scraping (HIGH PRIORITY)
      let menuData: MenuData | undefined;
      const websiteUrl = businessData?.website || this.extractWebsiteFromBasicSearch(basicInfo);
      if (websiteUrl) {
        try {
          const menuResult = await menuParserService.scrapeWebsiteMenu(websiteUrl);
          if (menuResult.data) {
            menuData = menuResult.data;
            allSources.push(menuResult.source);
          }
        } catch (error) {
          console.warn('Menu scraping failed:', error);
        }
      }

      // 4. Reviews collection from free sources (MEDIUM PRIORITY)
      let reviewsData: ReviewData[] = [];
      if (businessData?.reviews) {
        reviewsData = businessData.reviews;
      }

      // 5. Google News search (MEDIUM PRIORITY)
      let newsData: NewsData[] = [];
      try {
        const newsResult = await googleNewsService.searchBusinessNews(query, location);
        newsData = newsResult.data;
        if (newsData.length > 0) {
          allSources.push(newsResult.source);
        }
      } catch (error) {
        console.warn('Google News search failed:', error);
      }

      // 5.1. Social Media News search (MEDIUM PRIORITY)
      try {
        const socialNewsData = await googleNewsService.searchSocialMediaContent(query, location);
        if (socialNewsData.length > 0) {
          newsData = [...newsData, ...socialNewsData];
          allSources.push({
            type: 'social_media',
            url: 'https://facebook.com,https://instagram.com,https://linkedin.com,https://twitter.com',
            timestamp: new Date(),
            confidence: 0.7,
            dataPoints: socialNewsData.length,
          });
        }
      } catch (error) {
        console.warn('Social media news search failed:', error);
      }

      // 6. Social media data from free sources (LOW PRIORITY)
      let socialData: SocialMediaData[] = [];
      if (businessData?.socialMedia) {
        const social = businessData.socialMedia;
        if (social.facebook) {
          socialData.push({
            platform: 'Facebook',
            handle: this.extractHandleFromUrl(social.facebook),
            followers: undefined,
            postsPerWeek: undefined,
            engagement: undefined,
            lastPost: undefined,
          });
        }
        if (social.instagram) {
          socialData.push({
            platform: 'Instagram',
            handle: this.extractHandleFromUrl(social.instagram),
            followers: undefined,
            postsPerWeek: undefined,
            engagement: undefined,
            lastPost: undefined,
          });
        }
      }

      const comprehensiveData: ComprehensiveData = {
        basicInfo,
        businessData,
        menuData,
        reviewsData,
        newsData,
        socialData,
        sources: allSources,
      };

      return {
        data: comprehensiveData,
        sources: allSources,
      };
    } catch (error) {
      console.error('Comprehensive search failed:', error);
      // Fallback to basic search
      const basicSearch = await this.searchCompanyInfo(query);
      return {
        data: {
          basicInfo: basicSearch.data,
          sources: basicSearch.sources,
        },
        sources: basicSearch.sources,
      };
    }
  }

  // Keep existing method for backward compatibility
  async searchCompanyInfo(query: string): Promise<{
    data: any;
    sources: DataSource[];
  }> {
    const sources: DataSource[] = [];
    let searchResults: SerperSearchResult[] = [];

    // Use Serper API for search if available
    if (this.serperApiKey) {
      try {
        const response = await fetch('https://google.serper.dev/search', {
          method: 'POST',
          headers: {
            'X-API-KEY': this.serperApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: `${query} restaurant menu location contact`,
            num: 10,
          }),
        });

        if (response.ok) {
          const data: SerperResponse = await response.json();
          searchResults = data.organic || [];
          
          // Add search sources
          searchResults.forEach(result => {
            sources.push({
              type: 'search',
              url: result.link,
              timestamp: new Date(),
            });
          });
        }
      } catch (error) {
        console.error('Serper API error:', error);
      }
    }

    // Extract company information from search results
    const companyData = this.extractCompanyData(searchResults, query);

    return {
      data: companyData,
      sources,
    };
  }

  private extractCompanyData(searchResults: SerperSearchResult[], query: string) {
    // Basic extraction logic - in a real implementation, this would be more sophisticated
    const companyData = {
      name: query,
      searchResults: searchResults.map(result => ({
        title: result.title,
        snippet: result.snippet,
        url: result.link,
        date: result.date,
      })),
      extractedInfo: {
        description: '',
        locations: [] as string[],
        cuisine: '',
        founded: '',
        size: '',
      },
    };

    // Simple extraction patterns
    searchResults.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      
      // Extract cuisine type
      const cuisineKeywords = [
        'italian', 'chinese', 'japanese', 'mexican', 'indian', 'thai', 'french',
        'american', 'mediterranean', 'korean', 'vietnamese', 'greek', 'spanish',
        'pizza', 'burger', 'sushi', 'bbq', 'seafood', 'steakhouse', 'cafe', 'bakery'
      ];
      
      cuisineKeywords.forEach(cuisine => {
        if (text.includes(cuisine) && !companyData.extractedInfo.cuisine) {
          companyData.extractedInfo.cuisine = cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
        }
      });

      // Extract location information
      const locationPattern = /(?:located|in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
      let locationMatch;
      while ((locationMatch = locationPattern.exec(result.snippet)) !== null) {
        const location = locationMatch[1];
        if (!companyData.extractedInfo.locations.includes(location)) {
          companyData.extractedInfo.locations.push(location);
        }
      }

      // Use first meaningful snippet as description
      if (!companyData.extractedInfo.description && result.snippet.length > 50) {
        companyData.extractedInfo.description = result.snippet;
      }
    });

    return companyData;
  }

  async scrapeWebsite(url: string): Promise<{
    data: any;
    source: DataSource;
  }> {
    // Basic website scraping - in production, you'd use a proper scraping service
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ProspectPulse/1.0)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      
      // Basic extraction - in production, use Cheerio or similar
      const data = {
        title: this.extractTitle(html),
        description: this.extractDescription(html),
        content: html.substring(0, 5000), // Limit content size
      };

      return {
        data,
        source: {
          type: 'website',
          url,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      throw error;
    }
  }

  private extractTitle(html: string): string {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }

  private extractDescription(html: string): string {
    const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    return descMatch ? descMatch[1].trim() : '';
  }

  private extractWebsiteFromBasicSearch(basicInfo: any): string | null {
    if (basicInfo.searchResults && basicInfo.searchResults.length > 0) {
      for (const result of basicInfo.searchResults) {
        try {
          const url = new URL(result.url);
          // Skip common domains that aren't the business website
          const skipDomains = ['facebook.com', 'instagram.com', 'twitter.com', 'yelp.com', 'google.com', 'tripadvisor.com'];
          if (!skipDomains.some(domain => url.hostname.includes(domain))) {
            return result.url;
          }
        } catch (error) {
          continue;
        }
      }
    }
    return null;
  }

  private async searchRecentNews(query: string, location?: string): Promise<NewsData[]> {
    if (!this.serperApiKey) {
      return [];
    }

    try {
      const searchQuery = location ? `${query} ${location} restaurant news` : `${query} restaurant news`;
      const response = await fetch('https://google.serper.dev/news', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: searchQuery,
          num: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`News search failed: ${response.status}`);
      }

      const data = await response.json();
      const newsResults = data.news || [];

      return newsResults.map((item: any) => ({
        title: item.title,
        summary: item.snippet,
        date: item.date,
        source: item.source,
        url: item.link,
        sentiment: this.analyzeSentiment(item.title + ' ' + item.snippet),
      }));
    } catch (error) {
      console.error('News search error:', error);
      return [];
    }
  }

  private async checkSocialMediaPresence(query: string, basicInfo: any): Promise<SocialMediaData[]> {
    const socialData: SocialMediaData[] = [];

    // Extract social media links from search results
    if (basicInfo.searchResults) {
      for (const result of basicInfo.searchResults) {
        const url = result.url.toLowerCase();

        if (url.includes('facebook.com')) {
          socialData.push({
            platform: 'Facebook',
            handle: this.extractSocialHandle(result.url, 'facebook'),
            followers: undefined, // Would need Facebook API for actual data
            postsPerWeek: undefined,
            engagement: undefined,
            lastPost: undefined,
          });
        } else if (url.includes('instagram.com')) {
          socialData.push({
            platform: 'Instagram',
            handle: this.extractSocialHandle(result.url, 'instagram'),
            followers: undefined, // Would need Instagram API for actual data
            postsPerWeek: undefined,
            engagement: undefined,
            lastPost: undefined,
          });
        } else if (url.includes('twitter.com') || url.includes('x.com')) {
          socialData.push({
            platform: 'Twitter/X',
            handle: this.extractSocialHandle(result.url, 'twitter'),
            followers: undefined,
            postsPerWeek: undefined,
            engagement: undefined,
            lastPost: undefined,
          });
        }
      }
    }

    return socialData;
  }

  private extractSocialHandle(url: string, platform: string): string | undefined {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);

      if (pathParts.length > 0) {
        return pathParts[0];
      }
    } catch (error) {
      // Invalid URL
    }
    return undefined;
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['success', 'growth', 'expansion', 'award', 'best', 'excellent', 'popular', 'thriving'];
    const negativeWords = ['closure', 'closed', 'problem', 'issue', 'complaint', 'lawsuit', 'violation', 'failed'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractHandleFromUrl(url: string): string | undefined {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);

      if (pathParts.length > 0) {
        // Remove common prefixes
        const handle = pathParts[0];
        if (!['pages', 'profile.php', 'people'].includes(handle)) {
          return handle;
        }
        if (pathParts.length > 1) {
          return pathParts[1];
        }
      }
    } catch (error) {
      // Invalid URL
    }
    return undefined;
  }
}

export const dataCollectionService = new DataCollectionService();
