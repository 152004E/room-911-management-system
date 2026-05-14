/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        room: {
          dark: '#081425',
          primary: '#2563EB',
          success: '#10FB72',
          error: '#FF3131',
          card: 'rgba(30, 41, 59, 0.7)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'room': '8px',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(37, 99, 235, 0.4)',
      },
    },
  },
  plugins: [],
}
