import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/services/gemini';
import { AnalyzeRequest, AnalyzeResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Prospect ID is required' },
        { status: 400 }
      );
    }

    // Check for comprehensive data first (new enhanced format)
    const comprehensiveData = (body as any).comprehensiveData;
    const searchData = (body as any).searchData; // Fallback to old format

    if (!comprehensiveData && !searchData) {
      return NextResponse.json(
        { error: 'Search data not found. Please search first.' },
        { status: 404 }
      );
    }

    let profile: any;
    let insights: any;
    let salesTools: any;

    if (comprehensiveData) {
      // Use enhanced analysis with comprehensive data
      console.log('Using enhanced analysis with comprehensive data');

      // Generate enhanced prospect profile
      profile = await geminiService.generateEnhancedProspectProfile(comprehensiveData);

      // Generate enhanced business insights
      insights = await geminiService.generateEnhancedBusinessInsights(comprehensiveData, profile);

      // Generate sales tools with enhanced context
      salesTools = await geminiService.generateSalesTools(profile, insights);

    } else {
      // Fallback to basic analysis
      console.log('Using basic analysis with search data');

      // Generate prospect profile using basic method
      profile = await geminiService.generateProspectProfile(searchData);

      // Generate business insights
      insights = await geminiService.generateBusinessInsights(searchData, profile);

      // Generate sales tools
      salesTools = await geminiService.generateSalesTools(profile, insights);
    }

    // Prepare sources
    const sources = (body as any).sources || [];

    const response: AnalyzeResponse = {
      profile,
      insights,
      salesTools,
      sources,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analysis API error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          { error: 'AI service not configured. Please check API keys.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'AI service temporarily unavailable. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'prospect-analysis',
    timestamp: new Date().toISOString(),
  });
}
