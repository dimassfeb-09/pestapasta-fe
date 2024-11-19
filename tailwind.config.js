/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D73A35",
        secondary: "#F9C880",
        secondaryLight: "#F9F7DC",
        greenTeal: "#49D4BA"
      }
    },
  },
  plugins: [],
}