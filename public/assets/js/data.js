// Application Data Configuration
const AppData = {
    // Brand Configuration
    brand: {
        name: "ProspectPulse",
        tagline: "AI Sales Intelligence",
        logo: "PP"
    },

    // Loading Steps
    loadingSteps: [
        "Searching company website...",
        "Analyzing social media presence...",
        "Gathering recent news and updates...",
        "Generating sales insights..."
    ],

    // Example Companies
    examples: [
        "KFC Singapore",
        "Starbucks", 
        "McDonald's Malaysia"
    ],

    // Feature Cards
    features: [
        {
            icon: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
                <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/>
            </svg>`,
            title: "Instant Analysis",
            description: "Get comprehensive company insights in under 30 seconds"
        },
        {
            icon: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"/>
            </svg>`,
            title: "Smart Conversation Starters",
            description: "AI-generated talking points tailored to each prospect"
        },
        {
            icon: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/>
            </svg>`,
            title: "Multi-Source Data",
            description: "Website, social media, news, and review aggregation"
        }
    ],

    // Demo Results Data
    demoResults: {
        companyInfo: {
            description: "Fast food restaurant chain with strong local presence and growth potential in Southeast Asia.",
            founded: "2018",
            size: "Large",
            category: "Fast Food",
            priceRange: "$$"
        },
        
        conversationStarters: [
            {
                id: 1,
                text: "I noticed KFC Singapore has been expanding rapidly. How are you managing POS operations across multiple locations?",
                color: "blue"
            },
            {
                id: 2,
                text: "Your digital ordering growth is impressive. I'd love to show you how StoreHub can optimize your omnichannel strategy.",
                color: "green"
            },
            {
                id: 3,
                text: "With your focus on customer experience, our analytics could help identify peak hour optimization opportunities.",
                color: "orange"
            }
        ],

        objections: [
            {
                objection: "We already have a POS system that works fine.",
                response: "I understand your current system works. StoreHub integrates seamlessly while providing advanced analytics that can increase efficiency by 20-30%, especially for multi-location operations like yours."
            }
        ],

        insights: {
            opportunities: [
                "Digital ordering system expansion across all locations",
                "Enhanced customer analytics and loyalty programs",
                "Multi-location inventory management optimization"
            ],
            strengths: [
                "Strong brand recognition in Southeast Asian markets",
                "Established customer base with high loyalty",
                "Proven track record of successful expansion"
            ]
        },

        dataSources: [
            { name: "Website", icon: "🌐", description: "Company Info" },
            { name: "Facebook", icon: "📘", description: "Social Presence" },
            { name: "Instagram", icon: "📷", description: "Visual Content" },
            { name: "News", icon: "📰", description: "Recent Updates" }
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppData;
}
