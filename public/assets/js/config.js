// Tailwind Configuration
const TailwindConfig = {
    theme: {
        extend: {
            colors: {
                'primary': '#ff6b35',
                'primary-hover': '#e55a2b',
                'secondary': '#34495e',
                'accent': '#3b82f6',
                'success': '#10b981',
                'warning': '#f59e0b',
                'surface': '#ffffff',
                'background': '#f8fafc',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            }
        }
    }
};

// Apply Tailwind configuration
if (typeof tailwind !== 'undefined') {
    tailwind.config = TailwindConfig;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TailwindConfig;
}
