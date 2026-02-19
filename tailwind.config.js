/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oak: {
          dark: '#0f172a',
          primary: '#224b0c', // Forest Green
          secondary: '#6f4e37', // Earthy Brown
          accent: '#b8860b', // Warm Amber
          'status-green': '#4ade80',
          'status-red': '#f87171',
        }
      }
    },
  },
  plugins: [],
}
