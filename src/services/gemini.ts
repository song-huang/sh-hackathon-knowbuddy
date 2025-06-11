import { GoogleGenerativeAI } from '@google/generative-ai';
import { BusinessInsights, SalesTools, ProspectProfile, MenuData, ReviewData, NewsData } from '@/types';
import { reviewAnalysisService } from './reviewAnalysis';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse AI response');
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
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
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
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const insights = JSON.parse(jsonMatch[0]);

        // Enhance with review analysis if available
        if (reviewAnalysis) {
          insights.painPoints = [...(insights.painPoints || []), ...reviewAnalysis.painPoints];
          insights.operationalChallenges = [...(insights.operationalChallenges || []), ...reviewAnalysis.operationalIssues];
          insights.customerSentiment = reviewAnalysis.sentimentScores;
        }

        return insights;
      }

      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Error generating enhanced business insights:', error);
      throw error;
    }
  }

  async generateBusinessInsights(companyData: any, profile: ProspectProfile): Promise<BusinessInsights> {
    const prompt = `
    Based on the company data and profile, generate business insights for sales purposes:
    
    Company Data: ${JSON.stringify(companyData, null, 2)}
    Profile: ${JSON.stringify(profile, null, 2)}
    
    Provide JSON response:
    {
      "recentUpdates": ["Recent update 1", "Recent update 2"],
      "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
      "challenges": ["Challenge 1", "Challenge 2"],
      "marketPosition": "Market position description"
    }
    
    Focus on actionable insights for restaurant technology sales.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Error generating business insights:', error);
      throw error;
    }
  }

  async generateSalesTools(profile: ProspectProfile, insights: BusinessInsights): Promise<SalesTools> {
    const prompt = `
    Generate sales tools for approaching this restaurant prospect:
    
    Profile: ${JSON.stringify(profile, null, 2)}
    Insights: ${JSON.stringify(insights, null, 2)}
    
    Context: We're selling StoreHub's restaurant management system (POS, inventory, analytics, etc.)
    
    Provide JSON response:
    {
      "conversationStarters": [
        "Personalized opener 1",
        "Personalized opener 2", 
        "Personalized opener 3"
      ],
      "potentialObjections": [
        {
          "objection": "Common objection",
          "response": "Suggested response"
        }
      ],
      "valuePropositions": [
        "Value prop 1",
        "Value prop 2"
      ]
    }
    
    Make conversation starters specific to this restaurant's situation.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Error generating sales tools:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
