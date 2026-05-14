/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f6ff',
          100: '#f0ecff',
          200: '#ddd7ff',
          300: '#c9b8ff',
          400: '#b094ff',
          500: '#9370ff',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#3d0a7a',
        },
        secondary: {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#e8dccf',
          300: '#dbc6b6',
          400: '#c4a894',
          500: '#ad8a72',
          600: '#764ba2',
          700: '#5a3a7d',
          800: '#432956',
          900: '#2c1b3a',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
