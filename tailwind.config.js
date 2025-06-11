/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ProspectPulse Color System
        primary: {
          DEFAULT: '#ff6b35',
          hover: '#e55a2b',
        },
        secondary: '#34495e',
        accent: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        surface: '#ffffff',
        background: '#f8fafc',
        
        // StoreHub Legacy Colors
        'storehub-orange': {
          DEFAULT: '#ff6b35',
          hover: '#e55a2b',
        },
        'storehub-blue': {
          DEFAULT: '#34495e',
          hover: '#2c3e50',
        },
        'storehub-gray': {
          DEFAULT: '#6c757d',
          light: '#adb5bd',
        },
        'storehub-bg': '#f8f9fa',
        'storehub-card': '#ffffff',
        'storehub-border': '#e1e8ed',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'typing': 'typing 1.5s infinite',
        'lightning-flash': 'lightningFlash 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        typing: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0.3' },
        },
        lightningFlash: {
          '0%': { opacity: '0.3', transform: 'rotate(0deg)' },
          '10%': { opacity: '1', transform: 'rotate(0deg)' },
          '20%': { opacity: '0.3', transform: 'rotate(0deg)' },
          '30%': { opacity: '1', transform: 'rotate(0deg)' },
          '40%': { opacity: '0.3', transform: 'rotate(0deg)' },
          '50%': { opacity: '0.3', transform: 'rotate(45deg)' },
          '100%': { opacity: '0.3', transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #ff6b35 0%, #f39c12 100%)',
        'gradient-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
