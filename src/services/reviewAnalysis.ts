import { ReviewData, DataSource } from "@/types";

interface ReviewAnalysisResult {
  painPoints: string[];
  positiveAspects: string[];
  commonComplaints: string[];
  operationalIssues: string[];
  sentimentScores: {
    overall: number;
    food: number;
    service: number;
    ambiance: number;
  };
}

class ReviewAnalysisService {
  // Keywords for different aspects of restaurant experience
  private readonly painPointKeywords = {
    service: [
      "slow service",
      "rude staff",
      "unfriendly",
      "poor service",
      "bad service",
      "long wait",
      "waited forever",
      "ignored",
      "unprofessional",
      "attitude",
      "no attention",
      "dismissive",
      "unhelpful",
    ],
    food: [
      "cold food",
      "overcooked",
      "undercooked",
      "tasteless",
      "bland",
      "stale",
      "poor quality",
      "not fresh",
      "burnt",
      "soggy",
      "dry",
      "greasy",
      "small portions",
      "overpriced",
      "expensive",
    ],
    operations: [
      "dirty",
      "unclean",
      "messy",
      "disorganized",
      "chaotic",
      "loud",
      "cramped",
      "uncomfortable",
      "broken",
      "out of order",
      "cash only",
      "no card",
      "payment issues",
      "system down",
    ],
    ordering: [
      "wrong order",
      "missing items",
      "incorrect",
      "forgot",
      "mixed up",
      "no online ordering",
      "cant order online",
      "phone busy",
      "hard to reach",
    ],
  };

  private readonly positiveKeywords = {
    service: [
      "excellent service",
      "friendly staff",
      "attentive",
      "professional",
      "helpful",
      "courteous",
      "welcoming",
      "great service",
      "amazing staff",
    ],
    food: [
      "delicious",
      "amazing food",
      "excellent food",
      "fresh",
      "tasty",
      "flavorful",
      "perfect",
      "outstanding",
      "incredible",
      "best",
    ],
    operations: [
      "clean",
      "organized",
      "efficient",
      "quick",
      "fast",
      "smooth",
      "easy ordering",
      "convenient",
      "modern",
      "updated",
    ],
  };

  analyzeReviews(reviews: ReviewData[]): ReviewAnalysisResult {
    if (reviews.length === 0) {
      return {
        painPoints: [],
        positiveAspects: [],
        commonComplaints: [],
        operationalIssues: [],
        sentimentScores: {
          overall: 0,
          food: 0,
          service: 0,
          ambiance: 0,
        },
      };
    }

    const painPoints = this.extractPainPoints(reviews);
    const positiveAspects = this.extractPositiveAspects(reviews);
    const commonComplaints = this.extractCommonComplaints(reviews);
    const operationalIssues = this.extractOperationalIssues(reviews);
    const sentimentScores = this.calculateSentimentScores(reviews);

    return {
      painPoints,
      positiveAspects,
      commonComplaints,
      operationalIssues,
      sentimentScores,
    };
  }

  private extractPainPoints(reviews: ReviewData[]): string[] {
    const painPointCounts: { [key: string]: number } = {};

    reviews.forEach((review) => {
      if (review.rating <= 3) {
        // Focus on negative/neutral reviews
        const text = review.text.toLowerCase();

        // Check for service issues
        this.painPointKeywords.service.forEach((keyword) => {
          if (text.includes(keyword)) {
            painPointCounts["Poor customer service and staff attitude"] =
              (painPointCounts["Poor customer service and staff attitude"] ||
                0) + 1;
          }
        });

        // Check for food issues
        this.painPointKeywords.food.forEach((keyword) => {
          if (text.includes(keyword)) {
            painPointCounts["Food quality and preparation issues"] =
              (painPointCounts["Food quality and preparation issues"] || 0) + 1;
          }
        });

        // Check for operational issues
        this.painPointKeywords.operations.forEach((keyword) => {
          if (text.includes(keyword)) {
            painPointCounts["Operational and cleanliness concerns"] =
              (painPointCounts["Operational and cleanliness concerns"] || 0) +
              1;
          }
        });

        // Check for ordering issues
        this.painPointKeywords.ordering.forEach((keyword) => {
          if (text.includes(keyword)) {
            painPointCounts["Order accuracy and system issues"] =
              (painPointCounts["Order accuracy and system issues"] || 0) + 1;
          }
        });
      }
    });

    // Return top pain points
    return Object.entries(painPointCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([painPoint]) => painPoint);
  }

  private extractPositiveAspects(reviews: ReviewData[]): string[] {
    const positiveCounts: { [key: string]: number } = {};

    reviews.forEach((review) => {
      if (review.rating >= 4) {
        // Focus on positive reviews
        const text = review.text.toLowerCase();

        // Check for service positives
        this.positiveKeywords.service.forEach((keyword) => {
          if (text.includes(keyword)) {
            positiveCounts["Excellent customer service"] =
              (positiveCounts["Excellent customer service"] || 0) + 1;
          }
        });

        // Check for food positives
        this.positiveKeywords.food.forEach((keyword) => {
          if (text.includes(keyword)) {
            positiveCounts["High-quality food and taste"] =
              (positiveCounts["High-quality food and taste"] || 0) + 1;
          }
        });

        // Check for operational positives
        this.positiveKeywords.operations.forEach((keyword) => {
          if (text.includes(keyword)) {
            positiveCounts["Efficient operations and cleanliness"] =
              (positiveCounts["Efficient operations and cleanliness"] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(positiveCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([aspect]) => aspect);
  }

  private extractCommonComplaints(reviews: ReviewData[]): string[] {
    const complaints: { [key: string]: number } = {};

    reviews.forEach((review) => {
      if (review.rating <= 2) {
        // Focus on very negative reviews
        const text = review.text.toLowerCase();

        // Specific complaint patterns
        if (
          text.includes("long wait") ||
          text.includes("slow") ||
          text.includes("waited")
        ) {
          complaints["Long waiting times"] =
            (complaints["Long waiting times"] || 0) + 1;
        }

        if (
          text.includes("expensive") ||
          text.includes("overpriced") ||
          text.includes("too much")
        ) {
          complaints["High prices"] = (complaints["High prices"] || 0) + 1;
        }

        if (
          text.includes("small portion") ||
          text.includes("tiny") ||
          text.includes("not enough")
        ) {
          complaints["Small portion sizes"] =
            (complaints["Small portion sizes"] || 0) + 1;
        }

        if (
          text.includes("cash only") ||
          text.includes("no card") ||
          text.includes("payment")
        ) {
          complaints["Limited payment options"] =
            (complaints["Limited payment options"] || 0) + 1;
        }

        if (text.includes("parking") || text.includes("no parking")) {
          complaints["Parking issues"] =
            (complaints["Parking issues"] || 0) + 1;
        }
      }
    });

    return Object.entries(complaints)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([complaint]) => complaint);
  }

  private extractOperationalIssues(reviews: ReviewData[]): string[] {
    const issues: string[] = [];
    const issuePatterns = [
      {
        pattern: /cash only|no card|payment.*problem/i,
        issue: "Limited payment methods - opportunity for modern POS system",
      },
      {
        pattern: /no.*online.*order|cant.*order.*online/i,
        issue: "No online ordering system - digital transformation opportunity",
      },
      {
        pattern: /system.*down|pos.*not.*work|machine.*broken/i,
        issue: "POS system reliability issues - upgrade opportunity",
      },
      {
        pattern: /long.*queue|slow.*service|waited.*long/i,
        issue: "Service efficiency issues - workflow optimization needed",
      },
      {
        pattern: /wrong.*order|mixed.*up|forgot.*item/i,
        issue: "Order accuracy problems - better order management needed",
      },
    ];

    const reviewTexts = reviews
      .map((r) => r.text)
      .join(" ")
      .toLowerCase();

    issuePatterns.forEach(({ pattern, issue }) => {
      if (pattern.test(reviewTexts)) {
        issues.push(issue);
      }
    });

    return issues;
  }

  private calculateSentimentScores(reviews: ReviewData[]): {
    overall: number;
    food: number;
    service: number;
    ambiance: number;
  } {
    if (reviews.length === 0) {
      return { overall: 0, food: 0, service: 0, ambiance: 0 };
    }

    const overall =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    // Calculate aspect-specific scores based on keyword analysis
    let foodScore = 0;
    let serviceScore = 0;
    let ambianceScore = 0;
    let foodCount = 0;
    let serviceCount = 0;
    let ambianceCount = 0;

    reviews.forEach((review) => {
      const text = review.text.toLowerCase();

      // Food-related mentions
      if (
        text.includes("food") ||
        text.includes("taste") ||
        text.includes("meal") ||
        text.includes("dish")
      ) {
        foodScore += review.rating;
        foodCount++;
      }

      // Service-related mentions
      if (
        text.includes("service") ||
        text.includes("staff") ||
        text.includes("waiter") ||
        text.includes("server")
      ) {
        serviceScore += review.rating;
        serviceCount++;
      }

      // Ambiance-related mentions
      if (
        text.includes("atmosphere") ||
        text.includes("ambiance") ||
        text.includes("place") ||
        text.includes("environment")
      ) {
        ambianceScore += review.rating;
        ambianceCount++;
      }
    });

    return {
      overall: Math.round(overall * 10) / 10,
      food:
        foodCount > 0 ? Math.round((foodScore / foodCount) * 10) / 10 : overall,
      service:
        serviceCount > 0
          ? Math.round((serviceScore / serviceCount) * 10) / 10
          : overall,
      ambiance:
        ambianceCount > 0
          ? Math.round((ambianceScore / ambianceCount) * 10) / 10
          : overall,
    };
  }

  // Generate sales-relevant insights from review analysis
  generateSalesInsights(analysis: ReviewAnalysisResult): {
    opportunities: string[];
    objections: Array<{ objection: string; response: string }>;
  } {
    const opportunities: string[] = [];
    const objections: Array<{ objection: string; response: string }> = [];

    // Generate opportunities based on pain points
    analysis.painPoints.forEach((painPoint) => {
      if (painPoint.includes("service")) {
        opportunities.push(
          "Staff training and customer service improvement through better POS workflow"
        );
      }
      if (painPoint.includes("order") || painPoint.includes("system")) {
        opportunities.push(
          "Order accuracy improvement with modern POS system and kitchen display"
        );
      }
      if (painPoint.includes("payment")) {
        opportunities.push(
          "Multiple payment options and faster checkout process"
        );
      }
    });

    // Generate objections based on common complaints
    analysis.commonComplaints.forEach((complaint) => {
      if (complaint.includes("expensive") || complaint.includes("price")) {
        objections.push({
          objection:
            "We're already struggling with costs, we can't afford new systems",
          response:
            "I understand cost is a concern. Our POS system actually helps reduce costs through better inventory management, reduced waste, and faster service that increases table turnover. Most clients see ROI within 6 months.",
        });
      }
      if (complaint.includes("cash only")) {
        objections.push({
          objection: "Our customers prefer cash, we don't need card payments",
          response:
            "While cash is important, offering multiple payment options can increase average order value by 15-20%. Our system handles both seamlessly, and you'll capture sales from customers who only have cards.",
        });
      }
    });

    return { opportunities, objections };
  }
}

export const reviewAnalysisService = new ReviewAnalysisService();
