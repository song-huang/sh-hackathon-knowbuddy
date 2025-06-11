// Utility functions for ProspectPulse application

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Extracts domain from URL or returns the input if it's already a domain
 */
export function extractDomain(input: string): string {
  try {
    // If it's already a URL, extract the hostname
    if (input.startsWith('http://') || input.startsWith('https://')) {
      return new URL(input).hostname;
    }
    
    // If it looks like a domain (contains a dot), return as is
    if (input.includes('.') && !input.includes(' ')) {
      return input;
    }
    
    // Otherwise, it's probably a company name
    return '';
  } catch (error) {
    return '';
  }
}

/**
 * Formats a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Capitalizes the first letter of each word
 */
export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Validates email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sanitizes text for safe display
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
}

/**
 * Formats currency values
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Calculates confidence score based on data quality
 */
export function calculateConfidence(data: {
  hasWebsite?: boolean;
  hasDescription?: boolean;
  hasLocation?: boolean;
  hasCuisine?: boolean;
  sourceCount?: number;
}): number {
  let score = 0.5; // Base score
  
  if (data.hasWebsite) score += 0.2;
  if (data.hasDescription) score += 0.15;
  if (data.hasLocation) score += 0.1;
  if (data.hasCuisine) score += 0.1;
  if (data.sourceCount && data.sourceCount > 1) score += 0.05 * Math.min(data.sourceCount - 1, 3);
  
  return Math.min(score, 1.0);
}

/**
 * Extracts keywords from text for analysis
 */
export function extractKeywords(text: string, maxKeywords = 10): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);

  const wordCounts: { [key: string]: number } = {};

  text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word))
    .forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

  return Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}


