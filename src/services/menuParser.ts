import axios from 'axios';
import * as cheerio from 'cheerio';
import { MenuData, MenuItem, DataSource } from '@/types';

class MenuParserService {
  private userAgent = 'Mozilla/5.0 (compatible; ProspectPulse/1.0; +https://storehub.com)';

  async scrapeWebsiteMenu(url: string): Promise<{
    data: MenuData | null;
    source: DataSource;
  }> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      
      // Try to find menu-related content
      const menuData = this.extractMenuData($);
      
      return {
        data: menuData,
        source: {
          type: 'menu',
          url,
          timestamp: new Date(),
          confidence: menuData ? 0.7 : 0.1,
          dataPoints: menuData ? menuData.items.length : 0,
        },
      };
    } catch (error) {
      console.error(`Error scraping menu from ${url}:`, error);
      return {
        data: null,
        source: {
          type: 'menu',
          url,
          timestamp: new Date(),
          confidence: 0,
          dataPoints: 0,
        },
      };
    }
  }

  private extractMenuData($: cheerio.CheerioAPI): MenuData | null {
    const items: MenuItem[] = [];
    const categories: Set<string> = new Set();
    const prices: number[] = [];

    // Common menu selectors
    const menuSelectors = [
      '.menu-item', '.menu-product', '.food-item', '.dish',
      '[class*="menu"]', '[class*="food"]', '[class*="dish"]',
      '.product', '.item', '[data-menu]'
    ];

    // Try different menu extraction strategies
    for (const selector of menuSelectors) {
      const menuItems = $(selector);
      if (menuItems.length > 0) {
        menuItems.each((_, element) => {
          const item = this.extractMenuItem($, $(element));
          if (item) {
            items.push(item);
            categories.add(item.category);
            if (item.price) {
              prices.push(item.price);
            }
          }
        });
        
        if (items.length > 0) break;
      }
    }

    // If no structured menu found, try text-based extraction
    if (items.length === 0) {
      const textItems = this.extractMenuFromText($);
      items.push(...textItems);
      textItems.forEach(item => {
        categories.add(item.category);
        if (item.price) prices.push(item.price);
      });
    }

    if (items.length === 0) {
      return null;
    }

    // Determine price range
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices),
      currency: this.detectCurrency($),
    } : {
      min: 0,
      max: 0,
      currency: 'USD',
    };

    // Extract specialties (items marked as popular, signature, etc.)
    const specialties = items
      .filter(item => item.isSignature)
      .map(item => item.name)
      .slice(0, 5);

    return {
      categories: Array.from(categories),
      items,
      priceRange,
      specialties,
    };
  }

  private extractMenuItem($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): MenuItem | null {
    const name = this.extractItemName($, element);
    if (!name) return null;

    const description = this.extractItemDescription($, element);
    const price = this.extractItemPrice($, element);
    const category = this.extractItemCategory($, element);
    const isSignature = this.isSignatureItem($, element);

    return {
      name: name.trim(),
      description: description?.trim(),
      price,
      category: category || 'General',
      isSignature,
    };
  }

  private extractItemName($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    // Try various selectors for item names
    const nameSelectors = [
      '.name', '.title', '.item-name', '.product-name', '.dish-name',
      'h1', 'h2', 'h3', 'h4', '.menu-item-title', '[class*="name"]'
    ];

    for (const selector of nameSelectors) {
      const nameEl = element.find(selector).first();
      if (nameEl.length && nameEl.text().trim()) {
        return nameEl.text().trim();
      }
    }

    // Fallback to element text if no specific selector found
    const text = element.text().trim();
    if (text && text.length < 100) {
      return text.split('\n')[0].trim();
    }

    return null;
  }

  private extractItemDescription($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    const descSelectors = [
      '.description', '.desc', '.item-description', '.product-description',
      '.ingredients', '.details', 'p', '.menu-item-description'
    ];

    for (const selector of descSelectors) {
      const descEl = element.find(selector).first();
      if (descEl.length && descEl.text().trim()) {
        return descEl.text().trim();
      }
    }

    return null;
  }

  private extractItemPrice($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): number | null {
    const priceSelectors = [
      '.price', '.cost', '.amount', '.item-price', '.product-price',
      '[class*="price"]', '[data-price]'
    ];

    for (const selector of priceSelectors) {
      const priceEl = element.find(selector).first();
      if (priceEl.length) {
        const priceText = priceEl.text().trim();
        const price = this.parsePrice(priceText);
        if (price) return price;
      }
    }

    // Try to find price in the element text
    const text = element.text();
    const price = this.parsePrice(text);
    return price;
  }

  private extractItemCategory($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string {
    // Try to find category from parent elements or data attributes
    const categorySelectors = [
      '[data-category]', '.category', '.section', '.menu-section'
    ];

    for (const selector of categorySelectors) {
      const categoryEl = element.closest(selector);
      if (categoryEl.length) {
        const category = categoryEl.attr('data-category') || categoryEl.text().split('\n')[0].trim();
        if (category && category.length < 50) {
          return category;
        }
      }
    }

    return 'General';
  }

  private isSignatureItem($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): boolean {
    const text = element.text().toLowerCase();
    const signatureKeywords = [
      'signature', 'popular', 'bestseller', 'chef', 'special', 'featured',
      'recommended', 'house special', 'must try'
    ];

    return signatureKeywords.some(keyword => text.includes(keyword)) ||
           element.hasClass('signature') ||
           element.hasClass('popular') ||
           element.hasClass('featured');
  }

  private parsePrice(text: string): number | null {
    // Remove common currency symbols and extract number
    const priceMatch = text.match(/[\$£€¥₹₽]\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*[\$£€¥₹₽]/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1] || priceMatch[2]);
      return isNaN(price) ? null : price;
    }

    // Try to match just numbers that look like prices
    const numberMatch = text.match(/\b(\d{1,3}(?:\.\d{2})?)\b/);
    if (numberMatch) {
      const price = parseFloat(numberMatch[1]);
      // Reasonable price range check (0.50 to 999.99)
      if (price >= 0.5 && price <= 999.99) {
        return price;
      }
    }

    return null;
  }

  private detectCurrency($: cheerio.CheerioAPI): string {
    const text = $.html();
    
    if (text.includes('$')) return 'USD';
    if (text.includes('£')) return 'GBP';
    if (text.includes('€')) return 'EUR';
    if (text.includes('¥')) return 'JPY';
    if (text.includes('₹')) return 'INR';
    if (text.includes('₽')) return 'RUB';
    if (text.includes('RM')) return 'MYR';
    if (text.includes('S$')) return 'SGD';
    
    return 'USD'; // Default
  }

  private extractMenuFromText($: cheerio.CheerioAPI): MenuItem[] {
    const items: MenuItem[] = [];
    const text = $('body').text();
    
    // Simple pattern matching for menu items
    // This is a basic implementation - could be enhanced with ML
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 5 && trimmed.length < 100) {
        const price = this.parsePrice(trimmed);
        if (price) {
          const name = trimmed.replace(/[\$£€¥₹₽]\s*\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*[\$£€¥₹₽]/g, '').trim();
          if (name.length > 2) {
            items.push({
              name,
              price,
              category: 'General',
              isSignature: false,
            });
          }
        }
      }
    }
    
    return items.slice(0, 20); // Limit to prevent noise
  }
}

export const menuParserService = new MenuParserService();
