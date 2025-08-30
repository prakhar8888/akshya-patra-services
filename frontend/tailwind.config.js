import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This enables our dark mode feature
  theme: {
    extend: {
      colors: {
        // --- Updated and Expanded Color Palette ---
        'brand-green': {
          light: '#6EE7B7',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
        'brand-gray': {
          lightest: '#F9FAFB', // Light backgrounds
          light: '#E5E7EB',   // Borders
          DEFAULT: '#6B7280', // Main text
          dark: '#374151',   // Dark text, light mode card backgrounds
          darkest: '#1F2937',  // Dark backgrounds
        },

        // --- CSS Variable Powered Theme ---
        // These will automatically switch between light and dark mode
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'background': 'var(--color-background)',
        'foreground': 'var(--color-foreground)',
        'card': 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        'border': 'var(--color-border)',
        'input': 'var(--color-input)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '50%': { opacity: '.75' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideInUp: 'slideInUp 0.5s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  // ENTERPRISE FEATURE: Official Tailwind Plugins for forms and typography
  plugins: [
    forms,
    typography,
  ],
}
