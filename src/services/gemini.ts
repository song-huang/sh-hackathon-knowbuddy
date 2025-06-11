import { BusinessInsights, SalesTools, ProspectProfile, MenuData, ReviewData, NewsData } from '@/types';
import { reviewAnalysisService } from './reviewAnalysis';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
}

class GeminiService {
  private apiKey: string;
  private baseUrl: string;
  private axiosInstance: any;

  private cleanJsonString(jsonStr: string): string {
    // Remove any markdown code blocks
    jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Fix unescaped apostrophes in JSON strings - this is the main issue
    // Look for patterns like "text's more text" and remove the apostrophe or replace with safe alternative
    jsonStr = jsonStr.replace(/"([^"]*)'([^"]*)"/g, '"$1$2"');

    // Fix truncated JSON by finding the last complete property
    const lastCompleteProperty = jsonStr.lastIndexOf('",');
    const lastCompleteArray = jsonStr.lastIndexOf(']');
    const lastBrace = jsonStr.lastIndexOf('}');

    if (lastCompleteProperty > lastBrace || lastCompleteArray > lastBrace) {
      // JSON is truncated, try to fix it
      const cutPoint = Math.max(lastCompleteProperty + 1, lastCompleteArray);
      jsonStr = jsonStr.substring(0, cutPoint) + '\n}';
      console.log('Fixed truncated JSON at position:', cutPoint);
    }

    // Additional fixes for common truncation patterns
    if (jsonStr.includes('...')) {
      // Remove truncation indicators and try to close properly
      jsonStr = jsonStr.replace(/[^",}\]]*\.{3,}[^",}\]]*/g, '');
      // Ensure proper closing
      if (!jsonStr.endsWith('}') && !jsonStr.endsWith(']')) {
        jsonStr += '}';
      }
    }

    // Fix common JSON formatting issues - but be more conservative
    jsonStr = jsonStr
      // Fix trailing commas
      .replace(/,(\s*[}\]])/g, '$1')
      // Fix multiple spaces
      .replace(/\s+/g, ' ')
      // Trim
      .trim();

    return jsonStr;
  }

  private parseJsonSafely(text: string): any {
    try {
      console.log('Parsing AI response, length:', text.length);

      // First, try to extract JSON from markdown code blocks
      let jsonStr = '';

      // Look for ```json blocks first
      const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (markdownMatch) {
        jsonStr = markdownMatch[1];
        console.log('Found JSON in markdown block');
      } else {
        // Fallback: look for any JSON object
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        jsonStr = jsonMatch[0];
        console.log('Found JSON object without markdown');
      }

      console.log('Raw JSON string length:', jsonStr.length);
      console.log('Raw JSON preview:', jsonStr.substring(0, 200));

      // Clean the JSON string
      jsonStr = this.cleanJsonString(jsonStr);
      console.log('Cleaned JSON string length:', jsonStr.length);
      console.log('Cleaned JSON preview:', jsonStr.substring(0, 200));

      // Try to parse
      const parsed = JSON.parse(jsonStr);
      console.log('JSON parsed successfully');
      return parsed;
    } catch (error) {
      console.error('JSON parsing failed:', error);
      console.error('Problematic JSON:', text.substring(0, 500) + '...');

      // Try to extract partial data for better fallback
      const partialData = this.extractPartialData(text);

      return {
        error: 'Failed to parse AI response',
        rawResponse: text.substring(0, 200) + '...',
        partialData
      };
    }
  }

  private extractPartialData(text: string): any {
    // Try to extract some useful information even if JSON parsing fails
    const result: any = {};

    // Extract name
    const nameMatch = text.match(/"name":\s*"([^"]+)"/);
    if (nameMatch) result.name = nameMatch[1];

    // Extract description
    const descMatch = text.match(/"description":\s*"([^"]+)"/);
    if (descMatch) result.description = descMatch[1];

    // Extract conversation starters
    const startersMatch = text.match(/"conversationStarters":\s*\[([\s\S]*?)\]/);
    if (startersMatch) {
      const starters = startersMatch[1].match(/"([^"]+)"/g);
      if (starters) {
        result.conversationStarters = starters.map(s => s.replace(/"/g, ''));
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    // Configure axios with proxy support
    const proxyUrl = process.env.HTTP_PROXY || process.env.http_proxy;
    const axiosConfig: any = {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey,
      },
    };

    if (proxyUrl) {
      console.log('Configuring Gemini API with axios and proxy:', proxyUrl);
      const agent = proxyUrl.startsWith('https:')
        ? new HttpsProxyAgent(proxyUrl)
        : new HttpProxyAgent(proxyUrl);

      axiosConfig.httpAgent = agent;
      axiosConfig.httpsAgent = agent;
    }

    this.axiosInstance = axios.create(axiosConfig);
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096, // Increased for longer responses
      }
    };

    try {
      console.log('Making direct HTTP call to Gemini API with axios...');
      console.log('Using proxy:', process.env.HTTP_PROXY);

      const response = await this.axiosInstance.post(this.baseUrl, requestBody);
      const data: GeminiResponse = response.data;

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('Gemini API response received successfully');
      console.log('Response length:', generatedText.length);
      return generatedText;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }

  // Enhanced method for comprehensive data
  async generateEnhancedProspectProfile(comprehensiveData: {
    basicInfo: any;
    businessData?: any;
    menuData?: MenuData;
    reviewsData?: ReviewData[];
    newsData?: NewsData[];
  }): Promise<ProspectProfile> {
    const prompt = `
    Based on the following comprehensive data about a restaurant/food business, generate a detailed prospect profile.

    Basic Search Data: ${JSON.stringify(comprehensiveData.basicInfo, null, 2)}

    ${comprehensiveData.businessData ? `Business Data: ${JSON.stringify(comprehensiveData.businessData, null, 2)}` : ''}

    ${comprehensiveData.menuData ? `Menu Data: ${JSON.stringify(comprehensiveData.menuData, null, 2)}` : ''}

    ${comprehensiveData.reviewsData && comprehensiveData.reviewsData.length > 0 ?
      `Customer Reviews (${comprehensiveData.reviewsData.length} reviews): ${JSON.stringify(comprehensiveData.reviewsData.slice(0, 5), null, 2)}` : ''}

    ${comprehensiveData.newsData && comprehensiveData.newsData.length > 0 ?
      `Recent News: ${JSON.stringify(comprehensiveData.newsData, null, 2)}` : ''}

    Return a JSON object with the following structure:
    {
      "name": "Business name",
      "description": "Comprehensive business description based on all available data",
      "founded": "Year founded (if available)",
      "locations": ["Location 1", "Location 2"],
      "size": "Small/Medium/Large (based on review count, locations, etc.)",
      "cuisine": "Cuisine type from menu or places data",
      "menuHighlights": ["Signature dishes from menu data"],
      "priceRange": "$ to $$$$ based on menu prices or places data",
      "website": "Website URL if available",
      "phone": "Phone number if available",
      "email": "Email if found",
      "businessHours": "Operating hours summary",
      "rating": "Average rating from reviews",
      "reviewCount": "Number of reviews",
      "digitalMaturity": "Low/Medium/High based on online presence",
      "franchiseStatus": "Independent/Franchise/Chain based on analysis"
    }

    Analyze all data comprehensively. For digitalMaturity, consider: website quality, online ordering, social media presence.
    For franchiseStatus, look for chain indicators, multiple locations, corporate structure.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      return this.parseJsonSafely(text);
    } catch (error) {
      console.error('Error generating enhanced prospect profile:', error);
      throw error;
    }
  }

  async generateProspectProfile(companyData: any): Promise<ProspectProfile> {
    const prompt = `
    Based on the following company data, generate a comprehensive prospect profile for a restaurant/food business:
    
    Company Data: ${JSON.stringify(companyData, null, 2)}
    
    Please provide a JSON response with the following structure:
    {
      "name": "Company name",
      "description": "Brief business description",
      "founded": "Year founded (if available)",
      "locations": ["Location 1", "Location 2"],
      "size": "Business size (small/medium/large)",
      "cuisine": "Type of cuisine",
      "menuHighlights": ["Popular dish 1", "Popular dish 2"],
      "priceRange": "Price range ($ / $$ / $$$ / $$$$)"
    }
    
    Focus on restaurant/food service specific information. If information is not available, use "Unknown" or leave array empty.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      return this.parseJsonSafely(text);
    } catch (error) {
      console.error('Error generating prospect profile:', error);
      throw error;
    }
  }

  // Enhanced business insights with review analysis
  async generateEnhancedBusinessInsights(
    comprehensiveData: {
      basicInfo: any;
      businessData?: any;
      menuData?: MenuData;
      reviewsData?: ReviewData[];
      newsData?: NewsData[];
    },
    profile: ProspectProfile
  ): Promise<BusinessInsights> {
    // First, analyze reviews if available
    let reviewAnalysis = null;
    if (comprehensiveData.reviewsData && comprehensiveData.reviewsData.length > 0) {
      reviewAnalysis = reviewAnalysisService.analyzeReviews(comprehensiveData.reviewsData);
    }

    const prompt = `
    Based on comprehensive data about this restaurant, generate detailed business insights for sales purposes:

    Profile: ${JSON.stringify(profile, null, 2)}

    ${comprehensiveData.businessData ? `Business Data: ${JSON.stringify(comprehensiveData.businessData, null, 2)}` : ''}

    ${comprehensiveData.menuData ? `Menu Analysis: ${JSON.stringify(comprehensiveData.menuData, null, 2)}` : ''}

    ${reviewAnalysis ? `Review Analysis: ${JSON.stringify(reviewAnalysis, null, 2)}` : ''}

    ${comprehensiveData.newsData && comprehensiveData.newsData.length > 0 ?
      `Recent News: ${JSON.stringify(comprehensiveData.newsData, null, 2)}` : ''}

    Provide comprehensive JSON response:
    {
      "recentUpdates": ["Recent developments, news, or changes"],
      "keyStrengths": ["Business strengths from all data sources"],
      "challenges": ["Operational challenges identified"],
      "marketPosition": "Market position and competitive standing",
      "customerSentiment": {
        "overall": 4.2,
        "food": 4.1,
        "service": 4.0,
        "ambiance": 4.3
      },
      "painPoints": ["Specific pain points from reviews and analysis"],
      "growthSignals": ["Indicators of business growth or expansion"],
      "competitiveAdvantages": ["Unique selling points and advantages"],
      "digitalPresence": {
        "hasWebsite": true,
        "hasOnlineOrdering": false,
        "socialMediaActive": true,
        "reviewsManaged": false
      },
      "operationalChallenges": ["Specific operational issues that StoreHub can solve"]
    }

    Focus on actionable insights for restaurant technology sales. Identify specific pain points that StoreHub's POS and management system can address.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      const insights = this.parseJsonSafely(text);

      // Enhance with review analysis if available
      if (reviewAnalysis && !insights.error) {
        insights.painPoints = [...(insights.painPoints || []), ...reviewAnalysis.painPoints];
        insights.operationalChallenges = [...(insights.operationalChallenges || []), ...reviewAnalysis.operationalIssues];
        insights.customerSentiment = reviewAnalysis.sentimentScores;
      }

      return insights;
    } catch (error) {
      console.error('Error generating enhanced business insights:', error);
      throw error;
    }
  }

  async generateBusinessInsights(_companyData: any, profile: ProspectProfile): Promise<BusinessInsights> {
    const prompt = `
    Analyze restaurant: ${profile.name || 'Unknown'}
    Type: ${profile.cuisine || 'Restaurant'}

    Return ONLY this JSON (keep each item under 50 characters):
    {
      "keyStrengths": ["Strength 1", "Strength 2"],
      "challenges": ["Challenge 1", "Challenge 2"]
    }

    Focus on restaurant technology needs.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      return this.parseJsonSafely(text);
    } catch (error) {
      console.error('Error generating business insights:', error);
      throw error;
    }
  }

  async generateSalesTools(profile: ProspectProfile, _insights: BusinessInsights): Promise<SalesTools> {
    const prompt = `
    Generate 3 conversation starters for StoreHub restaurant management system sales.

    Restaurant: ${profile.name || 'Unknown'}
    Type: ${profile.cuisine || 'Restaurant'}

    Context: StoreHub provides POS, inventory management, and analytics for restaurants.

    Return ONLY this JSON format (keep responses under 100 characters each):
    {
      "conversationStarters": [
        "Short opener 1",
        "Short opener 2",
        "Short opener 3"
      ]
    }

    Make each starter specific and concise.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      return this.parseJsonSafely(text);
    } catch (error) {
      console.error('Error generating sales tools:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
