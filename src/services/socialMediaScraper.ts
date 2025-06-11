import axios from 'axios';
import * as cheerio from 'cheerio';
import { SocialMediaData, DataSource } from '@/types';

interface SocialMediaResult {
  platform: string;
  handle?: string;
  followers?: number;
  postsPerWeek?: number;
  engagement?: number;
  lastPost?: string;
  profileUrl?: string;
  verified?: boolean;
  businessInfo?: {
    address?: string;
    phone?: string;
    website?: string;
    hours?: string;
  };
}

class SocialMediaScraperService {
  private userAgent = 'Mozilla/5.0 (compatible; ProspectPulse/1.0; +https://storehub.com)';

  async searchSocialMediaPresence(businessName: string, location?: string): Promise<{
    data: SocialMediaResult[];
    sources: DataSource[];
  }> {
    const results: SocialMediaResult[] = [];
    const sources: DataSource[] = [];

    try {
      // Search for Facebook presence
      const facebookData = await this.searchFacebook(businessName, location);
      if (facebookData) {
        results.push(facebookData);
        sources.push({
          type: 'social',
          url: facebookData.profileUrl || 'https://facebook.com',
          timestamp: new Date(),
          confidence: 0.8,
          dataPoints: Object.keys(facebookData).length,
        });
      }

      // Search for Instagram presence
      const instagramData = await this.searchInstagram(businessName, location);
      if (instagramData) {
        results.push(instagramData);
        sources.push({
          type: 'social',
          url: instagramData.profileUrl || 'https://instagram.com',
          timestamp: new Date(),
          confidence: 0.8,
          dataPoints: Object.keys(instagramData).length,
        });
      }

      return { data: results, sources };
    } catch (error) {
      console.error('Social media search error:', error);
      return { data: [], sources: [] };
    }
  }

  private async searchFacebook(businessName: string, location?: string): Promise<SocialMediaResult | null> {
    try {
      // Use Serper API to search for Facebook pages
      const serperApiKey = process.env.SERPER_API_KEY;
      if (!serperApiKey) {
        console.warn('SERPER_API_KEY not configured - Facebook search limited');
        return null;
      }

      const searchQuery = location 
        ? `site:facebook.com "${businessName}" "${location}" restaurant`
        : `site:facebook.com "${businessName}" restaurant`;

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
        throw new Error(`Facebook search failed: ${response.status}`);
      }

      const data = await response.json();
      const results = data.organic || [];

      if (results.length > 0) {
        const facebookResult = results[0];
        
        // Extract Facebook page information
        const handle = this.extractFacebookHandle(facebookResult.link);
        const businessInfo = this.extractBusinessInfoFromSnippet(facebookResult.snippet);

        return {
          platform: 'Facebook',
          handle,
          profileUrl: facebookResult.link,
          verified: facebookResult.snippet.toLowerCase().includes('verified'),
          businessInfo,
          followers: this.extractFollowerCount(facebookResult.snippet),
          engagement: this.estimateEngagement(facebookResult.snippet),
        };
      }

      return null;
    } catch (error) {
      console.error('Facebook search error:', error);
      return null;
    }
  }

  private async searchInstagram(businessName: string, location?: string): Promise<SocialMediaResult | null> {
    try {
      const serperApiKey = process.env.SERPER_API_KEY;
      if (!serperApiKey) {
        return null;
      }

      const searchQuery = location 
        ? `site:instagram.com "${businessName}" "${location}"`
        : `site:instagram.com "${businessName}"`;

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
        throw new Error(`Instagram search failed: ${response.status}`);
      }

      const data = await response.json();
      const results = data.organic || [];

      if (results.length > 0) {
        const instagramResult = results[0];
        
        const handle = this.extractInstagramHandle(instagramResult.link);
        
        return {
          platform: 'Instagram',
          handle,
          profileUrl: instagramResult.link,
          verified: instagramResult.snippet.toLowerCase().includes('verified'),
          followers: this.extractFollowerCount(instagramResult.snippet),
          postsPerWeek: this.estimatePostFrequency(instagramResult.snippet),
          engagement: this.estimateEngagement(instagramResult.snippet),
        };
      }

      return null;
    } catch (error) {
      console.error('Instagram search error:', error);
      return null;
    }
  }

  private extractFacebookHandle(url: string): string | undefined {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length > 0) {
        // Remove common Facebook path prefixes
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

  private extractInstagramHandle(url: string): string | undefined {
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

  private extractBusinessInfoFromSnippet(snippet: string): any {
    const businessInfo: any = {};
    
    // Extract phone number
    const phoneMatch = snippet.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      businessInfo.phone = phoneMatch[0];
    }

    // Extract address patterns
    const addressMatch = snippet.match(/\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln)/i);
    if (addressMatch) {
      businessInfo.address = addressMatch[0];
    }

    // Extract hours
    if (snippet.toLowerCase().includes('open') || snippet.toLowerCase().includes('hours')) {
      const hoursMatch = snippet.match(/(open|hours)[^.]*[0-9]{1,2}[:\s]*[0-9]{2}[^.]*/i);
      if (hoursMatch) {
        businessInfo.hours = hoursMatch[0];
      }
    }

    return Object.keys(businessInfo).length > 0 ? businessInfo : undefined;
  }

  private extractFollowerCount(snippet: string): number | undefined {
    // Look for follower/like patterns
    const patterns = [
      /(\d+(?:,\d+)*)\s*(?:followers|likes|fans)/i,
      /(\d+(?:\.\d+)?[KMB])\s*(?:followers|likes|fans)/i,
    ];

    for (const pattern of patterns) {
      const match = snippet.match(pattern);
      if (match) {
        const countStr = match[1];
        return this.parseCount(countStr);
      }
    }

    return undefined;
  }

  private parseCount(countStr: string): number {
    const cleanStr = countStr.replace(/,/g, '');
    
    if (cleanStr.includes('K')) {
      return parseFloat(cleanStr.replace('K', '')) * 1000;
    }
    if (cleanStr.includes('M')) {
      return parseFloat(cleanStr.replace('M', '')) * 1000000;
    }
    if (cleanStr.includes('B')) {
      return parseFloat(cleanStr.replace('B', '')) * 1000000000;
    }
    
    return parseInt(cleanStr) || 0;
  }

  private estimatePostFrequency(snippet: string): number | undefined {
    // Simple heuristic based on content freshness indicators
    if (snippet.toLowerCase().includes('daily') || snippet.toLowerCase().includes('every day')) {
      return 7;
    }
    if (snippet.toLowerCase().includes('weekly') || snippet.toLowerCase().includes('every week')) {
      return 1;
    }
    if (snippet.toLowerCase().includes('regular') || snippet.toLowerCase().includes('frequent')) {
      return 3;
    }
    
    return undefined;
  }

  private estimateEngagement(snippet: string): number | undefined {
    // Simple engagement estimation based on keywords
    let score = 0;
    
    if (snippet.toLowerCase().includes('popular')) score += 0.3;
    if (snippet.toLowerCase().includes('active')) score += 0.2;
    if (snippet.toLowerCase().includes('community')) score += 0.2;
    if (snippet.toLowerCase().includes('reviews') || snippet.toLowerCase().includes('comments')) score += 0.2;
    if (snippet.toLowerCase().includes('responsive')) score += 0.1;
    
    return score > 0 ? Math.min(score, 1) : undefined;
  }
}

export const socialMediaScraperService = new SocialMediaScraperService();
