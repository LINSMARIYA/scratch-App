/** @type {import('tailwindcss').Config} */
const customThemes=require('./themes/customThemes')
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: customThemes,
  },
  plugins: [],
}