import { NewsData, DataSource } from '@/types';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';

interface GoogleNewsResult {
  title: string;
  snippet: string;
  date: string;
  source: string;
  link: string;
  imageUrl?: string;
}

class GoogleNewsService {
  private serperApiKey: string;
  private fetchOptions: any;

  constructor() {
    this.serperApiKey = process.env.SERPER_API_KEY || '';
    if (!this.serperApiKey) {
      console.warn('SERPER_API_KEY not configured - Google News functionality will be limited');
    }

    // Configure proxy for fetch if available
    const proxyUrl = process.env.HTTP_PROXY || process.env.http_proxy;
    this.fetchOptions = {};

    if (proxyUrl) {
      console.log('Configuring Google News API with proxy:', proxyUrl);
      const agent = proxyUrl.startsWith('https:')
        ? new HttpsProxyAgent(proxyUrl)
        : new HttpProxyAgent(proxyUrl);

      this.fetchOptions.agent = agent;
    }
  }

  async searchBusinessNews(businessName: string, location?: string): Promise<{
    data: NewsData[];
    source: DataSource;
  }> {
    if (!this.serperApiKey) {
      return {
        data: [],
        source: {
          type: 'news',
          url: 'https://news.google.com',
          timestamp: new Date(),
          confidence: 0,
          dataPoints: 0,
        },
      };
    }

    try {
      // Search for recent news about the business
      const newsResults = await this.searchNews(businessName, location);
      
      // Process and analyze the news
      const processedNews = newsResults.map(result => this.processNewsItem(result));

      return {
        data: processedNews,
        source: {
          type: 'news',
          url: 'https://news.google.com',
          timestamp: new Date(),
          confidence: 0.8,
          dataPoints: processedNews.length,
        },
      };
    } catch (error) {
      console.error('Google News search error:', error);
      return {
        data: [],
        source: {
          type: 'news',
          url: 'https://news.google.com',
          timestamp: new Date(),
          confidence: 0,
          dataPoints: 0,
        },
      };
    }
  }

  private async searchNews(businessName: string, location?: string): Promise<GoogleNewsResult[]> {
    try {
      // Create search queries for different types of news
      const queries = [
        // Exact business name search
        location
          ? `"${businessName}" "${location}"`
          : `"${businessName}"`,

        // Business name with restaurant context
        location
          ? `${businessName} ${location} restaurant`
          : `${businessName} restaurant`,

        // Social media sources - Facebook
        `site:facebook.com ${businessName}`,

        // Social media sources - Instagram
        `site:instagram.com ${businessName}`,

        // Social media sources - LinkedIn
        `site:linkedin.com ${businessName}`,

        // Social media sources - Twitter/X
        `site:twitter.com ${businessName}`,

        // Industry news for context
        location
          ? `restaurant industry ${location} news`
          : 'restaurant industry news trends',

        // Broader food industry news
        location
          ? `food business ${location} news`
          : 'food business news',
      ];

      const allResults: GoogleNewsResult[] = [];

      for (const query of queries) {
        try {
          const response = await fetch('https://google.serper.dev/news', {
            method: 'POST',
            headers: {
              'X-API-KEY': this.serperApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: query,
              num: 5,
              tbs: 'qdr:y', // Last year
            }),
            ...this.fetchOptions,
          });

          if (!response.ok) {
            console.warn(`News search failed for query "${query}": ${response.status}`);
            continue;
          }

          const data = await response.json();
          const newsResults = data.news || [];

          for (const item of newsResults) {
            // Avoid duplicates
            if (!allResults.some(existing => existing.link === item.link)) {
              allResults.push({
                title: item.title,
                snippet: item.snippet,
                date: item.date,
                source: item.source,
                link: item.link,
                imageUrl: item.imageUrl,
              });
            }
          }
        } catch (queryError) {
          console.warn(`Error searching for query "${query}":`, queryError);
          continue;
        }
      }

      // Sort by relevance and recency
      return this.rankNewsResults(allResults, businessName).slice(0, 10);
    } catch (error) {
      console.error('News search error:', error);
      return [];
    }
  }

  private processNewsItem(newsItem: GoogleNewsResult): NewsData {
    return {
      title: newsItem.title,
      summary: newsItem.snippet,
      date: this.standardizeDate(newsItem.date),
      source: newsItem.source,
      url: newsItem.link,
      sentiment: this.analyzeSentiment(newsItem.title + ' ' + newsItem.snippet),
    };
  }

  private standardizeDate(dateStr: string): string {
    try {
      // Handle various date formats from Google News
      if (dateStr.includes('ago')) {
        // Handle relative dates like "2 days ago"
        const now = new Date();
        
        if (dateStr.includes('hour')) {
          const hours = parseInt(dateStr.match(/(\d+)/)?.[1] || '0');
          now.setHours(now.getHours() - hours);
        } else if (dateStr.includes('day')) {
          const days = parseInt(dateStr.match(/(\d+)/)?.[1] || '0');
          now.setDate(now.getDate() - days);
        } else if (dateStr.includes('week')) {
          const weeks = parseInt(dateStr.match(/(\d+)/)?.[1] || '0');
          now.setDate(now.getDate() - (weeks * 7));
        } else if (dateStr.includes('month')) {
          const months = parseInt(dateStr.match(/(\d+)/)?.[1] || '0');
          now.setMonth(now.getMonth() - months);
        }
        
        return now.toISOString();
      }

      // Try to parse as regular date
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }

      // Fallback to current date
      return new Date().toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const lowerText = text.toLowerCase();
    
    // Positive indicators
    const positiveWords = [
      'success', 'growth', 'expansion', 'award', 'best', 'excellent', 'popular', 
      'thriving', 'opening', 'new location', 'partnership', 'investment', 
      'recognition', 'achievement', 'milestone', 'celebration', 'launch',
      'innovative', 'breakthrough', 'record', 'profit', 'revenue'
    ];
    
    // Negative indicators
    const negativeWords = [
      'closure', 'closed', 'problem', 'issue', 'complaint', 'lawsuit', 
      'violation', 'failed', 'bankruptcy', 'debt', 'loss', 'decline',
      'controversy', 'scandal', 'investigation', 'fine', 'penalty',
      'criticism', 'protest', 'boycott', 'health violation', 'inspection'
    ];

    let positiveScore = 0;
    let negativeScore = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) {
        positiveScore++;
      }
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) {
        negativeScore++;
      }
    });

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  private rankNewsResults(results: GoogleNewsResult[], businessName: string): GoogleNewsResult[] {
    return results.sort((a, b) => {
      // Calculate relevance score
      const aRelevance = this.calculateRelevance(a, businessName);
      const bRelevance = this.calculateRelevance(b, businessName);
      
      // Calculate recency score (more recent = higher score)
      const aRecency = this.calculateRecency(a.date);
      const bRecency = this.calculateRecency(b.date);
      
      // Combined score (relevance weighted more heavily)
      const aScore = (aRelevance * 0.7) + (aRecency * 0.3);
      const bScore = (bRelevance * 0.7) + (bRecency * 0.3);
      
      return bScore - aScore;
    });
  }

  private calculateRelevance(newsItem: GoogleNewsResult, businessName: string): number {
    const text = (newsItem.title + ' ' + newsItem.snippet).toLowerCase();
    const businessNameLower = businessName.toLowerCase();
    const url = newsItem.link?.toLowerCase() || '';

    let score = 0;

    // Exact business name match
    if (text.includes(businessNameLower)) {
      score += 1.0;
    }

    // Social media content gets bonus relevance
    if (this.isSocialMediaSource(url)) {
      score += 0.5;

      // Additional bonus for social media engagement indicators
      const socialKeywords = ['post', 'update', 'announcement', 'share', 'like', 'comment'];
      socialKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          score += 0.1;
        }
      });
    }

    // Business-related keywords
    const businessKeywords = ['restaurant', 'food', 'dining', 'menu', 'chef', 'kitchen'];
    businessKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 0.1;
      }
    });

    // Important business events
    const eventKeywords = ['opening', 'expansion', 'award', 'partnership', 'investment'];
    eventKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 0.2;
      }
    });

    return Math.min(score, 2.5); // Increased cap to accommodate social media bonus
  }

  private isSocialMediaSource(url: string): boolean {
    const socialDomains = ['facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com'];
    return socialDomains.some(domain => url.includes(domain));
  }

  private calculateRecency(dateStr: string): number {
    try {
      const newsDate = new Date(this.standardizeDate(dateStr));
      const now = new Date();
      const daysDiff = (now.getTime() - newsDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Score decreases with age
      if (daysDiff <= 7) return 1.0;      // Last week
      if (daysDiff <= 30) return 0.8;     // Last month
      if (daysDiff <= 90) return 0.6;     // Last 3 months
      if (daysDiff <= 365) return 0.4;    // Last year
      return 0.2;                         // Older than a year
    } catch (error) {
      return 0.5; // Default score for unparseable dates
    }
  }

  // Search for social media content specifically
  async searchSocialMediaContent(businessName: string, location?: string): Promise<NewsData[]> {
    if (!this.serperApiKey) {
      return [];
    }

    try {
      const socialPlatforms = [
        'facebook.com',
        'instagram.com',
        'linkedin.com',
        'twitter.com'
      ];

      const allResults: GoogleNewsResult[] = [];

      for (const platform of socialPlatforms) {
        try {
          const query = location
            ? `site:${platform} "${businessName}" "${location}"`
            : `site:${platform} "${businessName}"`;

          const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
              'X-API-KEY': this.serperApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: query,
              num: 3, // Fewer results per platform to avoid overwhelming
            }),
            ...this.fetchOptions,
          });

          if (!response.ok) {
            console.warn(`Social media search failed for ${platform}: ${response.status}`);
            continue;
          }

          const data = await response.json();
          const searchResults = data.organic || [];

          for (const item of searchResults) {
            // Convert search results to news format
            if (!allResults.some(existing => existing.link === item.link)) {
              allResults.push({
                title: item.title,
                snippet: item.snippet,
                date: new Date().toISOString(), // Social media posts are typically recent
                source: this.extractSocialMediaSource(platform),
                link: item.link,
                imageUrl: item.thumbnail,
              });
            }
          }
        } catch (platformError) {
          console.warn(`Error searching ${platform}:`, platformError);
          continue;
        }
      }

      // Process and return results
      return allResults.map(result => this.processNewsItem(result));
    } catch (error) {
      console.error('Social media search error:', error);
      return [];
    }
  }

  private extractSocialMediaSource(platform: string): string {
    const platformNames: { [key: string]: string } = {
      'facebook.com': 'Facebook',
      'instagram.com': 'Instagram',
      'linkedin.com': 'LinkedIn',
      'twitter.com': 'Twitter/X'
    };
    return platformNames[platform] || platform;
  }

  // Get industry-specific news for context
  async getIndustryNews(location?: string): Promise<NewsData[]> {
    if (!this.serperApiKey) {
      return [];
    }

    try {
      const query = location 
        ? `restaurant industry news "${location}" trends`
        : 'restaurant industry news trends';

      const response = await fetch('https://google.serper.dev/news', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          num: 5,
          tbs: 'qdr:m', // Last month
        }),
        ...this.fetchOptions,
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const newsResults = data.news || [];

      return newsResults.map((item: any) => this.processNewsItem({
        title: item.title,
        snippet: item.snippet,
        date: item.date,
        source: item.source,
        link: item.link,
        imageUrl: item.imageUrl,
      }));
    } catch (error) {
      console.error('Industry news search error:', error);
      return [];
    }
  }
}

export const googleNewsService = new GoogleNewsService();
