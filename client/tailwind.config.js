/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F4ECD8',
        },
        mustard: {
          50: '#FDF8E8',
          100: '#FAF0C5',
          200: '#F5D97A',
          300: '#EEC94A',
          400: '#D4A017',
          500: '#B8870F',
          600: '#9A6E09',
          700: '#7A5407',
        },
        maroon: {
          50: '#FDF2F2',
          100: '#FBDADA',
          200: '#F4A8A8',
          300: '#E97070',
          400: '#C43A3A',
          500: '#7A1F1F',
          600: '#5C1717',
          700: '#3D0F0F',
        },
        olive: {
          50: '#F2F4EF',
          100: '#D8DDD0',
          200: '#A8B297',
          300: '#718260',
          400: '#4A5340',
          500: '#323B2B',
          600: '#1E2318',
        },
        spice: {
          orange: '#E8622A',
          turmeric: '#F5A623',
          coriander: '#7FA67A',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.14)',
        warm: '0 4px 24px rgba(212,160,23,0.15)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
