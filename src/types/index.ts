// Core data types for ProspectPulse application

export interface Prospect {
  id: string;
  name: string;
  domain: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analysis {
  id: string;
  prospectId: string;
  profile: ProspectProfile;
  insights: BusinessInsights;
  salesTools: SalesTools;
  sources: DataSource[];
  createdAt: Date;
}

export interface ProspectProfile {
  name: string;
  description: string;
  founded?: string;
  locations: string[];
  size?: string;
  cuisine: string;
  menuHighlights?: string[];
  priceRange?: string;
  // Enhanced fields
  website?: string;
  phone?: string;
  email?: string;
  businessHours?: string;
  rating?: number;
  reviewCount?: number;
  digitalMaturity?: 'Low' | 'Medium' | 'High';
  franchiseStatus?: 'Independent' | 'Franchise' | 'Chain';
}

export interface BusinessInsights {
  recentUpdates: string[];
  keyStrengths: string[];
  challenges: string[];
  marketPosition?: string;
  customerSentiment?: {
    overall: number;
    food: number;
    service: number;
    ambiance: number;
  };
  // Enhanced insights
  painPoints: string[];
  growthSignals: string[];
  competitiveAdvantages: string[];
  digitalPresence: {
    hasWebsite: boolean;
    hasOnlineOrdering: boolean;
    socialMediaActive: boolean;
    reviewsManaged: boolean;
  };
  operationalChallenges: string[];
}

export interface SalesTools {
  conversationStarters: string[];
  potentialObjections: {
    objection: string;
    response: string;
  }[];
  valuePropositions: string[];
}

export interface DataSource {
  type: 'website' | 'social' | 'news' | 'reviews' | 'search' | 'maps' | 'menu';
  url: string;
  timestamp: Date;
  confidence?: number;
  dataPoints?: number;
}

// Enhanced data collection types
export interface GooglePlacesData {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  businessHours?: string[];
  businessType?: string[];
  priceLevel?: number;
  photos?: string[];
}

export interface ReviewData {
  source: string;
  rating: number;
  text: string;
  date: string;
  author?: string;
  keywords?: string[];
}

export interface MenuData {
  categories: string[];
  items: MenuItem[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  specialties: string[];
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: number;
  category: string;
  isSignature?: boolean;
}

export interface SocialMediaData {
  platform: string;
  handle?: string;
  followers?: number;
  postsPerWeek?: number;
  engagement?: number;
  lastPost?: string;
}

export interface NewsData {
  title: string;
  summary: string;
  date: string;
  source: string;
  url: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

// API Request/Response types
export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  id: string;
  name: string;
  domain: string;
  type: string;
  confidence: number;
}

export interface AnalyzeRequest {
  id: string;
  includeReviews?: boolean;
  includeSocial?: boolean;
}

export interface AnalyzeResponse {
  profile: ProspectProfile;
  insights: BusinessInsights;
  salesTools: SalesTools;
  sources: DataSource[];
}

// UI Component Props
export interface SearchComponentProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export interface ResultCardProps {
  analysis: Analysis;
  onExport?: () => void;
  onCopy?: (text: string) => void;
}

export interface LoadingStateProps {
  stage: 'searching' | 'analyzing' | 'generating';
  progress?: number;
}
