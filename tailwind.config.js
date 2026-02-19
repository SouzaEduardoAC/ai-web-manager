/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mcp: {
          dark: '#0f172a', // gray-900 equivalent or slightly darker
          blue: '#60a5fa', // blue-400
          green: '#4ade80', // green-400
          red: '#f87171', // red-400
          yellow: '#facc15', // yellow-400
        }
      }
    },
  },
  plugins: [],
}