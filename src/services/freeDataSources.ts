import axios from 'axios';
import * as cheerio from 'cheerio';
import { ReviewData, DataSource, NewsData } from '@/types';

interface FreeBusinessData {
  name: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  cuisine?: string[];
  priceRange?: string;
  hours?: string[];
  reviews: ReviewData[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

class FreeDataSourcesService {
  private userAgent = 'Mozilla/5.0 (compatible; ProspectPulse/1.0; +https://storehub.com)';
  private serperApiKey: string;

  constructor() {
    this.serperApiKey = process.env.SERPER_API_KEY || '';
  }

  async collectBusinessData(businessName: string, location?: string): Promise<{
    data: FreeBusinessData | null;
    sources: DataSource[];
  }> {
    const sources: DataSource[] = [];
    
    try {
      // 1. 使用Serper搜索基本信息
      const basicData = await this.searchBasicInfo(businessName, location);
      if (!basicData) {
        return { data: null, sources: [] };
      }

      // 2. 搜索社交媒体链接
      const socialMedia = await this.findSocialMediaLinks(businessName, location);
      
      // 3. 搜索评论和评分信息
      const reviewData = await this.searchReviewData(businessName, location);
      
      // 4. 尝试从网站抓取更多信息
      let websiteData = null;
      if (basicData.website) {
        websiteData = await this.scrapeWebsiteInfo(basicData.website);
      }

      const businessData: FreeBusinessData = {
        name: basicData.name,
        description: basicData.description,
        address: basicData.address,
        phone: basicData.phone,
        website: basicData.website,
        rating: reviewData.rating,
        reviewCount: reviewData.reviewCount,
        cuisine: this.extractCuisineFromDescription(basicData.description),
        priceRange: reviewData.priceRange,
        hours: websiteData?.hours || [],
        reviews: reviewData.reviews,
        socialMedia,
      };

      sources.push({
        type: 'search',
        url: 'https://google.com/search',
        timestamp: new Date(),
        confidence: 0.8,
        dataPoints: Object.keys(businessData).length,
      });

      return { data: businessData, sources };
    } catch (error) {
      console.error('Free data sources error:', error);
      return { data: null, sources: [] };
    }
  }

  private async searchBasicInfo(businessName: string, location?: string) {
    if (!this.serperApiKey) return null;

    try {
      const query = location 
        ? `"${businessName}" "${location}" restaurant contact address phone`
        : `"${businessName}" restaurant contact address phone`;

      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          num: 5,
        }),
      });

      const data = await response.json();
      const results = data.organic || [];

      if (results.length === 0) return null;

      const firstResult = results[0];
      
      return {
        name: this.cleanBusinessName(firstResult.title),
        description: firstResult.snippet,
        website: firstResult.link,
        address: this.extractAddress(firstResult.snippet),
        phone: this.extractPhone(firstResult.snippet),
      };
    } catch (error) {
      console.error('Basic info search error:', error);
      return null;
    }
  }

  private async findSocialMediaLinks(businessName: string, location?: string) {
    if (!this.serperApiKey) return {};

    const socialMedia: any = {};

    try {
      // 搜索Facebook
      const facebookQuery = location 
        ? `site:facebook.com "${businessName}" "${location}"`
        : `site:facebook.com "${businessName}" restaurant`;

      const fbResponse = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: facebookQuery,
          num: 3,
        }),
      });

      const fbData = await fbResponse.json();
      if (fbData.organic && fbData.organic.length > 0) {
        socialMedia.facebook = fbData.organic[0].link;
      }

      // 搜索Instagram
      const instagramQuery = location 
        ? `site:instagram.com "${businessName}" "${location}"`
        : `site:instagram.com "${businessName}"`;

      const igResponse = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: instagramQuery,
          num: 3,
        }),
      });

      const igData = await igResponse.json();
      if (igData.organic && igData.organic.length > 0) {
        socialMedia.instagram = igData.organic[0].link;
      }

    } catch (error) {
      console.error('Social media search error:', error);
    }

    return socialMedia;
  }

  private async searchReviewData(businessName: string, location?: string) {
    if (!this.serperApiKey) {
      return { rating: 0, reviewCount: 0, reviews: [], priceRange: '' };
    }

    try {
      // 搜索评论相关信息
      const reviewQuery = location 
        ? `"${businessName}" "${location}" reviews rating stars`
        : `"${businessName}" restaurant reviews rating stars`;

      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: reviewQuery,
          num: 5,
        }),
      });

      const data = await response.json();
      const results = data.organic || [];

      let rating = 0;
      let reviewCount = 0;
      let priceRange = '';
      const reviews: ReviewData[] = [];

      // 从搜索结果中提取评分和评论信息
      for (const result of results) {
        const snippet = result.snippet;
        
        // 提取评分
        const ratingMatch = snippet.match(/(\d+(?:\.\d+)?)\s*(?:stars?|\/5|rating)/i);
        if (ratingMatch && !rating) {
          rating = parseFloat(ratingMatch[1]);
        }

        // 提取评论数量
        const reviewMatch = snippet.match(/(\d+(?:,\d+)*)\s*reviews?/i);
        if (reviewMatch && !reviewCount) {
          reviewCount = parseInt(reviewMatch[1].replace(/,/g, ''));
        }

        // 提取价格范围
        const priceMatch = snippet.match(/(\$+)/);
        if (priceMatch && !priceRange) {
          priceRange = priceMatch[1];
        }

        // 提取简单的评论文本
        if (snippet.length > 50 && reviews.length < 3) {
          reviews.push({
            source: 'Google Search',
            rating: rating || 4,
            text: snippet,
            date: new Date().toISOString(),
            author: 'Anonymous',
          });
        }
      }

      return { rating, reviewCount, reviews, priceRange };
    } catch (error) {
      console.error('Review data search error:', error);
      return { rating: 0, reviewCount: 0, reviews: [], priceRange: '' };
    }
  }

  private async scrapeWebsiteInfo(url: string) {
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      
      // 尝试提取营业时间
      const hours: string[] = [];
      $('*:contains("hours"), *:contains("open"), *:contains("Monday"), *:contains("Tuesday")').each((_, element) => {
        const text = $(element).text();
        if (text.match(/\d{1,2}:\d{2}|am|pm/i) && text.length < 100) {
          hours.push(text.trim());
        }
      });

      return { hours: hours.slice(0, 7) }; // 限制为7天
    } catch (error) {
      console.error('Website scraping error:', error);
      return null;
    }
  }

  private cleanBusinessName(title: string): string {
    // 清理标题，移除常见的后缀
    return title
      .replace(/\s*-\s*.*$/, '') // 移除破折号后的内容
      .replace(/\s*\|\s*.*$/, '') // 移除竖线后的内容
      .replace(/\s*\.\.\.$/, '') // 移除省略号
      .trim();
  }

  private extractAddress(text: string): string | undefined {
    // 简单的地址提取
    const addressMatch = text.match(/\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln)/i);
    return addressMatch ? addressMatch[0] : undefined;
  }

  private extractPhone(text: string): string | undefined {
    // 提取电话号码
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    return phoneMatch ? phoneMatch[0] : undefined;
  }

  private extractCuisineFromDescription(description: string): string[] {
    const cuisines: string[] = [];
    const cuisineKeywords = [
      'chinese', 'italian', 'japanese', 'mexican', 'indian', 'thai', 'french',
      'american', 'mediterranean', 'korean', 'vietnamese', 'greek', 'spanish',
      'pizza', 'burger', 'sushi', 'bbq', 'seafood', 'steakhouse', 'cafe',
      'bakery', 'deli', 'bistro', 'grill', 'fast food', 'fine dining'
    ];

    const lowerDesc = description.toLowerCase();
    cuisineKeywords.forEach(keyword => {
      if (lowerDesc.includes(keyword)) {
        cuisines.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });

    return cuisines.slice(0, 3); // 限制为3个
  }
}

export const freeDataSourcesService = new FreeDataSourcesService();
