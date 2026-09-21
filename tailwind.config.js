/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm off-white canvas
        canvas: '#FAF8F2',
        surface: '#FFFFFF',
        // Deep forest green — primary brand
        forest: {
          DEFAULT: '#1E4D3A',
          50: '#EEF4F0',
          100: '#D6E6DD',
          200: '#AECEBC',
          300: '#7FB295',
          400: '#4E8C6C',
          500: '#2E6A4C',
          600: '#1E4D3A',
          700: '#173D2E',
          800: '#102C21',
          900: '#0A1D16',
        },
        // Sage — positive indicators
        sage: {
          DEFAULT: '#8FB996',
          light: '#DDEBDD',
          dark: '#5E8E68',
        },
        // Soil brown / beige — soil information
        soil: {
          DEFAULT: '#9C7A54',
          light: '#EADFCB',
          beige: '#F0E7D6',
          dark: '#6F5637',
        },
        // Water / rainfall
        water: {
          DEFAULT: '#6FA8DC',
          light: '#DCEBF7',
          dark: '#3E7CB1',
        },
        // Temperature / warnings
        ember: {
          DEFAULT: '#E1975B',
          light: '#F8E7D5',
          dark: '#C0703A',
        },
        ink: {
          DEFAULT: '#26312B',
          soft: '#5B6660',
          faint: '#8A938D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(30, 77, 58, 0.04), 0 8px 24px rgba(30, 77, 58, 0.06)',
        'card-hover': '0 2px 6px rgba(30, 77, 58, 0.08), 0 16px 40px rgba(30, 77, 58, 0.10)',
        soft: '0 1px 3px rgba(38, 49, 43, 0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
