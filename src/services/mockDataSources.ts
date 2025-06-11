import { DataSource } from '@/types';

/**
 * Mock data sources service for testing enhanced platform support
 */
export class MockDataSourcesService {
  
  /**
   * Generate mock data sources for a restaurant/company
   */
  static generateMockSources(companyName: string): DataSource[] {
    const baseTimestamp = new Date();
    
    const mockSources: DataSource[] = [
      // Core business data
      {
        type: 'website',
        url: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 5), // 5 minutes ago
        confidence: 0.95,
        dataPoints: 15,
        platform: 'Official Website'
      },
      
      // Professional platforms
      {
        type: 'linkedin',
        url: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 10), // 10 minutes ago
        confidence: 0.88,
        dataPoints: 12,
        platform: 'LinkedIn Company Page'
      },
      
      {
        type: 'glassdoor',
        url: `https://glassdoor.com/Overview/Working-at-${companyName.replace(/\s+/g, '-')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 15), // 15 minutes ago
        confidence: 0.82,
        dataPoints: 8,
        platform: 'Glassdoor Reviews'
      },
      
      {
        type: 'crunchbase',
        url: `https://crunchbase.com/organization/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 20), // 20 minutes ago
        confidence: 0.75,
        dataPoints: 6,
        platform: 'Crunchbase Profile'
      },
      
      // Social media platforms
      {
        type: 'facebook',
        url: `https://facebook.com/${companyName.toLowerCase().replace(/\s+/g, '')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 8), // 8 minutes ago
        confidence: 0.90,
        dataPoints: 20,
        platform: 'Facebook Business Page'
      },
      
      {
        type: 'instagram',
        url: `https://instagram.com/${companyName.toLowerCase().replace(/\s+/g, '')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 12), // 12 minutes ago
        confidence: 0.85,
        dataPoints: 18,
        platform: 'Instagram Business Account'
      },
      
      {
        type: 'twitter',
        url: `https://twitter.com/${companyName.toLowerCase().replace(/\s+/g, '')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 18), // 18 minutes ago
        confidence: 0.78,
        dataPoints: 10,
        platform: 'Twitter/X Account'
      },
      
      // Review platforms
      {
        type: 'yelp',
        url: `https://yelp.com/biz/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 6), // 6 minutes ago
        confidence: 0.92,
        dataPoints: 25,
        platform: 'Yelp Business Profile'
      },
      
      {
        type: 'tripadvisor',
        url: `https://tripadvisor.com/Restaurant_Review-${companyName.replace(/\s+/g, '_')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 14), // 14 minutes ago
        confidence: 0.80,
        dataPoints: 15,
        platform: 'TripAdvisor Reviews'
      },
      
      {
        type: 'google',
        url: `https://maps.google.com/place/${companyName.replace(/\s+/g, '+')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 3), // 3 minutes ago
        confidence: 0.94,
        dataPoints: 22,
        platform: 'Google My Business'
      },
      
      // Food-specific platforms
      {
        type: 'zomato',
        url: `https://zomato.com/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 7), // 7 minutes ago
        confidence: 0.87,
        dataPoints: 16,
        platform: 'Zomato Restaurant'
      },
      
      {
        type: 'foursquare',
        url: `https://foursquare.com/v/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 16), // 16 minutes ago
        confidence: 0.73,
        dataPoints: 9,
        platform: 'Foursquare Venue'
      },
      
      // News and financial
      {
        type: 'news',
        url: `https://news.google.com/search?q=${companyName.replace(/\s+/g, '+')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 2), // 2 minutes ago
        confidence: 0.85,
        dataPoints: 12,
        platform: 'Google News'
      },
      
      {
        type: 'bloomberg',
        url: `https://bloomberg.com/quote/${companyName.toUpperCase().replace(/\s+/g, '')}`,
        timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 25), // 25 minutes ago
        confidence: 0.70,
        dataPoints: 5,
        platform: 'Bloomberg Terminal'
      }
    ];
    
    // Return a random subset to simulate real-world scenarios
    const shuffled = mockSources.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 6) + 6; // 6-12 sources
    return shuffled.slice(0, count);
  }
  
  /**
   * Generate sources for specific restaurant types
   */
  static generateRestaurantSources(restaurantName: string, cuisineType?: string): DataSource[] {
    const baseSources = this.generateMockSources(restaurantName);
    
    // Add cuisine-specific sources
    const additionalSources: DataSource[] = [];
    
    if (cuisineType?.toLowerCase().includes('chinese') || cuisineType?.toLowerCase().includes('asian')) {
      additionalSources.push({
        type: 'zomato',
        url: `https://zomato.com/${restaurantName.toLowerCase().replace(/\s+/g, '-')}-chinese`,
        timestamp: new Date(),
        confidence: 0.89,
        dataPoints: 18,
        platform: 'Zomato Chinese Cuisine'
      });
    }
    
    if (cuisineType?.toLowerCase().includes('fast food') || restaurantName.toLowerCase().includes('kfc') || restaurantName.toLowerCase().includes('mcdonald')) {
      additionalSources.push({
        type: 'foursquare',
        url: `https://foursquare.com/v/${restaurantName.toLowerCase().replace(/\s+/g, '-')}-fast-food`,
        timestamp: new Date(),
        confidence: 0.91,
        dataPoints: 14,
        platform: 'Foursquare Fast Food'
      });
    }
    
    return [...baseSources, ...additionalSources];
  }
  
  /**
   * Get high-quality sources only
   */
  static getHighQualitySources(sources: DataSource[]): DataSource[] {
    return sources.filter(source => source.confidence && source.confidence > 0.8);
  }
  
  /**
   * Get sources by platform type
   */
  static getSourcesByType(sources: DataSource[], type: string): DataSource[] {
    return sources.filter(source => source.type === type);
  }
  
  /**
   * Calculate total data points
   */
  static getTotalDataPoints(sources: DataSource[]): number {
    return sources.reduce((total, source) => total + (source.dataPoints || 0), 0);
  }
  
  /**
   * Get average confidence score
   */
  static getAverageConfidence(sources: DataSource[]): number {
    const sourcesWithConfidence = sources.filter(s => s.confidence);
    if (sourcesWithConfidence.length === 0) return 0;
    
    const total = sourcesWithConfidence.reduce((sum, s) => sum + (s.confidence || 0), 0);
    return total / sourcesWithConfidence.length;
  }
}

export default MockDataSourcesService;
