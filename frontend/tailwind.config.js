/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'google-spin': 'google-spin 1.5s linear infinite',
        'gradient-move': 'gradient-move 15s ease infinite',
      },
      keyframes: {
        'google-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'gradient-move': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      colors: {
        'google-blue': '#4285F4',
        'google-red': '#DB4437',
        'google-yellow': '#F4B400',
        'google-green': '#0F9D58',
      },
    },
  },
  plugins: [],
}
