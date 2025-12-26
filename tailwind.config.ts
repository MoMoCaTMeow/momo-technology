import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color Palette: Green (#006837) for AIU Cedar Society
        primary: {
          50: '#E6F5ED',
          100: '#CCEBDC',
          200: '#99D7B9',
          300: '#66C396',
          400: '#33AF73',
          500: '#006837', // Primary Green
          600: '#00532C',
          700: '#003E21',
          800: '#002916',
          900: '#00140B',
        },
        // Warm background colors
        warm: {
          50: '#FEF9F4',
          100: '#FAF7F2',
          200: '#F5F2ED',
          300: '#F0EDE8',
          400: '#EBE8E3',
          500: '#E6E3DE',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-geist-sans)',
          'var(--font-noto-sans-jp)',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'var(--font-geist-sans)',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        jp: ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'sans-serif'],
        // Zen Old Mincho for Japanese (optional)
        serif: ['var(--font-zen-old-mincho)', 'serif'],
      },
      fontSize: {
        // Fluid Typography
        xs: ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.5' }],
        sm: ['clamp(0.875rem, 1.8vw, 1rem)', { lineHeight: '1.6' }],
        base: ['clamp(1rem, 2vw, 1.125rem)', { lineHeight: '1.7' }],
        lg: ['clamp(1.125rem, 2.5vw, 1.25rem)', { lineHeight: '1.7' }],
        xl: ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.6' }],
        '2xl': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.5' }],
        '3xl': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.4' }],
        '4xl': ['clamp(2.5rem, 7vw, 4.5rem)', { lineHeight: '1.3' }],
        '5xl': ['clamp(3rem, 10vw, 6rem)', { lineHeight: '1.2' }],
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(0, 104, 55, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0, 104, 55, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 104, 55, 0.08) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(0, 104, 55, 0.12) 0px, transparent 50%)',
        'warm-gradient': 'linear-gradient(135deg, #fef9f4 0%, #faf7f2 25%, #f5f2ed 50%, #f0ede8 75%, #fef9f4 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

