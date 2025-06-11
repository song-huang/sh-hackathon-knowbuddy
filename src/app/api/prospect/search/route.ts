import { NextRequest, NextResponse } from 'next/server';
import { dataCollectionService } from '@/services/dataCollection';
import { SearchRequest, SearchResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const location = searchParams.get('location');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Enhanced comprehensive search
    const { data: comprehensiveData, sources } = await dataCollectionService.searchCompanyInfoComprehensive(query, location || undefined);

    // Generate a unique ID for this search
    const id = `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Determine business type and confidence based on comprehensive data
    let isRestaurant = false;
    let confidence = 0.5;

    // Check business data first (most reliable for restaurants)
    if (comprehensiveData.businessData) {
      isRestaurant = comprehensiveData.businessData.cuisine?.length > 0 ||
                    comprehensiveData.businessData.name?.toLowerCase().includes('restaurant') ||
                    comprehensiveData.businessData.name?.toLowerCase().includes('cafe') ||
                    comprehensiveData.businessData.name?.toLowerCase().includes('bar') ||
                    comprehensiveData.businessData.description?.toLowerCase().includes('restaurant') ||
                    comprehensiveData.businessData.description?.toLowerCase().includes('food');
      confidence = isRestaurant ? 0.9 : 0.7;
    }

    // Fallback to basic search data
    if (!isRestaurant && comprehensiveData.basicInfo) {
      isRestaurant = comprehensiveData.basicInfo.extractedInfo?.cuisine ||
                    comprehensiveData.basicInfo.searchResults?.some((result: any) =>
                      result.snippet.toLowerCase().includes('restaurant') ||
                      result.snippet.toLowerCase().includes('food') ||
                      result.snippet.toLowerCase().includes('menu')
                    );
      confidence = isRestaurant ? 0.8 : 0.6;
    }

    // Check menu data for additional confirmation
    if (comprehensiveData.menuData && comprehensiveData.menuData.items.length > 0) {
      isRestaurant = true;
      confidence = Math.max(confidence, 0.9);
    }

    // Determine business name from best available source
    let businessName = query;

    // Check if businessData name is meaningful (not generic terms)
    const genericTerms = ['contact us', 'locate us', 'find us', 'about us', 'home', 'menu'];
    const businessDataName = comprehensiveData.businessData?.name?.toLowerCase();

    if (businessDataName && !genericTerms.some(term => businessDataName.includes(term))) {
      businessName = comprehensiveData.businessData.name;
    } else if (comprehensiveData.basicInfo?.searchResults?.[0]?.title) {
      // Extract meaningful name from search result title
      const title = comprehensiveData.basicInfo.searchResults[0].title;
      const queryFirstWord = query.toLowerCase().split(' ')[0];

      // Look for the company name in the title
      const titleParts = title.split(/[:|–|-]/);
      let foundName = null;

      // Check each part of the title for the company name
      for (const part of titleParts) {
        const cleanPart = part.trim();
        if (cleanPart.toLowerCase().includes(queryFirstWord)) {
          // Extract just the company name (remove extra words)
          const words = cleanPart.split(' ');
          const companyWords = [];
          for (const word of words) {
            if (word.toLowerCase().includes(queryFirstWord) ||
                (companyWords.length > 0 && companyWords.length < 3)) {
              companyWords.push(word);
            }
            if (word.toLowerCase().includes(queryFirstWord)) {
              break;
            }
          }
          if (companyWords.length > 0) {
            foundName = companyWords.join(' ').replace(/[®™©]/g, '').trim();
            break;
          }
        }
      }

      businessName = foundName || query; // Fallback to original query
    }

    const response: SearchResponse = {
      id,
      name: businessName,
      domain: comprehensiveData.businessData?.website ?
              new URL(comprehensiveData.businessData.website).hostname :
              extractDomain(comprehensiveData.basicInfo?.searchResults || []),
      type: isRestaurant ? 'Restaurant' : 'Food Service',
      confidence: Math.round(confidence * 100) / 100,
    };

    // Store comprehensive data for later analysis
    (response as any).comprehensiveData = comprehensiveData;
    (response as any).sources = sources;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Enhanced search API error:', error);

    // Fallback to basic search if enhanced search fails
    try {
      const { data, sources } = await dataCollectionService.searchCompanyInfo(query);
      const id = `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const isRestaurant = data.extractedInfo?.cuisine ||
                          data.searchResults?.some((result: any) =>
                            result.snippet.toLowerCase().includes('restaurant') ||
                            result.snippet.toLowerCase().includes('food') ||
                            result.snippet.toLowerCase().includes('menu')
                          );

      const response: SearchResponse = {
        id,
        name: data.searchResults?.[0]?.title || data.name || query,
        domain: extractDomain(data.searchResults || []),
        type: isRestaurant ? 'Restaurant' : 'Food Service',
        confidence: isRestaurant ? 0.7 : 0.5,
      };

      (response as any).searchData = data;
      (response as any).sources = sources;

      return NextResponse.json(response);
    } catch (fallbackError) {
      console.error('Fallback search also failed:', fallbackError);
      return NextResponse.json(
        { error: 'Search service temporarily unavailable' },
        { status: 503 }
      );
    }
  }
}

function extractDomain(searchResults: any[]): string {
  for (const result of searchResults) {
    try {
      const url = new URL(result.url);
      // Skip common domains that aren't the business website
      const skipDomains = ['facebook.com', 'instagram.com', 'twitter.com', 'yelp.com', 'google.com'];
      if (!skipDomains.some(domain => url.hostname.includes(domain))) {
        return url.hostname;
      }
    } catch (error) {
      continue;
    }
  }
  return '';
}
