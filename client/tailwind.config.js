/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#F97316', // Primary Orange
          dark: '#EA580C',
        },
        primary: '#F97316',
        secondary: '#111827',
        accent: '#2563EB',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 40px -15px rgba(249, 115, 22, 0.12)',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      }
    },
  },
  plugins: [],
};
