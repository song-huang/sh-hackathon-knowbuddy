import {
  BusinessInsights,
  SalesTools,
  ProspectProfile,
  MenuData,
  ReviewData,
  NewsData,
} from "@/types";
import { reviewAnalysisService } from "./reviewAnalysis";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { HttpProxyAgent } from "http-proxy-agent";

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
    // Enhanced markdown code block removal
    // Handle various markdown patterns: ```json, ```, ```javascript, etc.
    jsonStr = jsonStr
      // Remove opening markdown blocks (with optional language specifier)
      .replace(/```(?:json|javascript|js)?\s*/gi, "")
      // Remove closing markdown blocks
      .replace(/```\s*$/gm, "")
      // Remove any remaining triple backticks
      .replace(/```/g, "")
      // Remove any leading/trailing whitespace from each line
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      // Remove empty lines
      .replace(/\n\s*\n/g, "\n")
      .trim();

    // Fix common JSON formatting issues
    jsonStr = jsonStr
      // Fix single quotes to double quotes (but preserve quotes within strings)
      .replace(/(?<!\\)'/g, '"')
      // Fix unquoted property names
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      // Fix trailing commas
      .replace(/,(\s*[}\]])/g, "$1")
      // Normalize whitespace but preserve structure
      .replace(/\s+/g, " ")
      // Final trim
      .trim();

    return jsonStr;
  }

  private parseJsonSafely(text: string): any {
    try {
      console.log("Original response text:", text.substring(0, 200) + "...");

      // Multiple strategies to extract JSON from markdown-wrapped responses
      let jsonStr = "";

      // Strategy 1: Look for JSON within markdown code blocks
      const markdownJsonMatch = text.match(
        /```(?:json)?\s*(\{[\s\S]*?\})\s*```/i
      );
      if (markdownJsonMatch) {
        jsonStr = markdownJsonMatch[1];
        console.log("Found JSON in markdown code block");
      } else {
        // Strategy 2: Look for the largest JSON object in the response
        const jsonMatches = text.match(/\{[\s\S]*?\}/g);
        if (jsonMatches && jsonMatches.length > 0) {
          // Take the longest match (most likely to be the complete JSON)
          jsonStr = jsonMatches.reduce((longest, current) =>
            current.length > longest.length ? current : longest
          );
          console.log("Found JSON object, using longest match");
        } else {
          // Strategy 3: Try to find JSON between common delimiters
          const delimiterMatch = text.match(
            /(?:```json\s*)?(\{[\s\S]*\})(?:\s*```)?/i
          );
          if (delimiterMatch) {
            jsonStr = delimiterMatch[1];
            console.log("Found JSON with delimiter matching");
          } else {
            throw new Error("No JSON found in response");
          }
        }
      }

      console.log("Raw JSON string length:", jsonStr.length);
      console.log("Raw JSON preview:", jsonStr.substring(0, 100) + "...");

      // Clean the JSON string
      jsonStr = this.cleanJsonString(jsonStr);
      console.log("Cleaned JSON string length:", jsonStr.length);

      // Try to parse
      const parsed = JSON.parse(jsonStr);
      console.log("JSON parsed successfully");
      return parsed;
    } catch (error) {
      console.error("JSON parsing failed:", error);
      console.error("Problematic text:", text.substring(0, 500) + "...");

      // Return a fallback object
      return {
        error: "Failed to parse AI response",
        rawResponse: text.substring(0, 200) + "...",
      };
    }
  }

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    this.baseUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    // Configure axios with proxy support
    const proxyUrl = process.env.HTTP_PROXY || process.env.http_proxy;
    const axiosConfig: any = {
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": this.apiKey,
      },
    };

    if (proxyUrl) {
      console.log("Configuring Gemini API with axios and proxy:", proxyUrl);
      const agent = proxyUrl.startsWith("https:")
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
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 102400, // Increased from 2048 to handle longer JSON responses
      },
    };

    try {
      console.log("Making direct HTTP call to Gemini API with axios...");
      console.log("Using proxy:", process.env.HTTP_PROXY);

      const response = await this.axiosInstance.post(this.baseUrl, requestBody);
      const data: GeminiResponse = response.data;

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response generated from Gemini API");
      }

      console.log("callGeminiAPI: ", data.candidates[0].content);

      const generatedText = data.candidates[0].content.parts[0].text;
      console.log("Gemini API response received successfully");
      console.log("Response length:", generatedText.length);
      return generatedText.replace(/```json\n?/, "").replace(/```$/, "");
    } catch (error) {
      console.error("Gemini API call failed:", error);
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

    ${
      comprehensiveData.businessData
        ? `Business Data: ${JSON.stringify(
            comprehensiveData.businessData,
            null,
            2
          )}`
        : ""
    }

    ${
      comprehensiveData.menuData
        ? `Menu Data: ${JSON.stringify(comprehensiveData.menuData, null, 2)}`
        : ""
    }

    ${
      comprehensiveData.reviewsData && comprehensiveData.reviewsData.length > 0
        ? `Customer Reviews (${
            comprehensiveData.reviewsData.length
          } reviews): ${JSON.stringify(
            comprehensiveData.reviewsData.slice(0, 5),
            null,
            2
          )}`
        : ""
    }

    ${
      comprehensiveData.newsData && comprehensiveData.newsData.length > 0
        ? `Recent News: ${JSON.stringify(comprehensiveData.newsData, null, 2)}`
        : ""
    }

    IMPORTANT: Return ONLY a valid JSON object. Do NOT use markdown formatting, code blocks, or any other text.
    Do NOT wrap your response in \`\`\`json or \`\`\` tags. Return pure JSON only.

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

    CRITICAL: Your response must start with { and end with }. No other text before or after.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);

      console.log("generateEnhancedProspectProfile:", text);
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating enhanced prospect profile:", error);
      throw error;
    }
  }

  async generateProspectProfile(companyData: any): Promise<ProspectProfile> {
    const prompt = `
    Based on the following company data, generate a comprehensive prospect profile for a restaurant/food business:
    
    Company Data: ${JSON.stringify(companyData, null, 2)}
    
    IMPORTANT: Return ONLY a valid JSON object. Do NOT use markdown formatting, code blocks, or any other text.
    Do NOT wrap your response in \`\`\`json or \`\`\` tags. Return pure JSON only.

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

    CRITICAL: Your response must start with { and end with }. No other text before or after.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating prospect profile:", error);
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
    if (
      comprehensiveData.reviewsData &&
      comprehensiveData.reviewsData.length > 0
    ) {
      reviewAnalysis = reviewAnalysisService.analyzeReviews(
        comprehensiveData.reviewsData
      );
    }

    const prompt = `
    Based on comprehensive data about this restaurant, generate detailed business insights for sales purposes:

    Profile: ${JSON.stringify(profile, null, 2)}

    ${
      comprehensiveData.businessData
        ? `Business Data: ${JSON.stringify(
            comprehensiveData.businessData,
            null,
            2
          )}`
        : ""
    }

    ${
      comprehensiveData.menuData
        ? `Menu Analysis: ${JSON.stringify(
            comprehensiveData.menuData,
            null,
            2
          )}`
        : ""
    }

    ${
      reviewAnalysis
        ? `Review Analysis: ${JSON.stringify(reviewAnalysis, null, 2)}`
        : ""
    }

    ${
      comprehensiveData.newsData && comprehensiveData.newsData.length > 0
        ? `Recent News: ${JSON.stringify(comprehensiveData.newsData, null, 2)}`
        : ""
    }

    IMPORTANT: Return ONLY a valid JSON object. Do NOT use markdown formatting, code blocks, or any other text.
    Do NOT wrap your response in \`\`\`json or \`\`\` tags. Return pure JSON only.

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

    CRITICAL: Your response must start with { and end with }. No other text before or after.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      const insights = JSON.parse(text);

      // Enhance with review analysis if available
      if (reviewAnalysis && !insights.error) {
        insights.painPoints = [
          ...(insights.painPoints || []),
          ...reviewAnalysis.painPoints,
        ];
        insights.operationalChallenges = [
          ...(insights.operationalChallenges || []),
          ...reviewAnalysis.operationalIssues,
        ];
        insights.customerSentiment = reviewAnalysis.sentimentScores;
      }

      return insights;
    } catch (error) {
      console.error("Error generating enhanced business insights:", error);
      throw error;
    }
  }

  async generateBusinessInsights(
    companyData: any,
    profile: ProspectProfile
  ): Promise<BusinessInsights> {
    const prompt = `
    Based on the company data and profile, generate business insights for sales purposes:
    
    Company Data: ${JSON.stringify(companyData, null, 2)}
    Profile: ${JSON.stringify(profile, null, 2)}
    
    IMPORTANT: Return ONLY a valid JSON object. Do NOT use markdown formatting, code blocks, or any other text.
    Do NOT wrap your response in \`\`\`json or \`\`\` tags. Return pure JSON only.

    Provide JSON response:
    {
      "recentUpdates": ["Recent update 1", "Recent update 2"],
      "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
      "challenges": ["Challenge 1", "Challenge 2"],
      "marketPosition": "Market position description"
    }

    Focus on actionable insights for restaurant technology sales.

    CRITICAL: Your response must start with { and end with }. No other text before or after.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating business insights:", error);
      throw error;
    }
  }

  async generateSalesTools(
    profile: ProspectProfile,
    insights: BusinessInsights
  ): Promise<SalesTools> {
    const prompt = `
    Generate sales tools for approaching this restaurant prospect:
    
    Profile: ${JSON.stringify(profile, null, 2)}
    Insights: ${JSON.stringify(insights, null, 2)}
    
    Context: We're selling StoreHub's restaurant management system (POS, inventory, analytics, etc.)

    IMPORTANT: Return ONLY a valid JSON object. Do NOT use markdown formatting, code blocks, or any other text.
    Do NOT wrap your response in \`\`\`json or \`\`\` tags. Return pure JSON only.
    Provide JSON response, and the potentialObjections should at least have 5 items
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

    CRITICAL: Your response must start with { and end with }. No other text before or after.
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating sales tools:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
