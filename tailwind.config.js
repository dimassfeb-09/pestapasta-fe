/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
      colors: {
        primary: "#D73A35",
        primaryDark: "#B52E2A",
        secondary: "#F9C880",
        secondaryLight: "#F9F7DC",
        greenTeal: "#49D4BA",
        greenTealDark: "#36B89F",
        ink: "#1F2937",
        muted: "#6B7280",
        surface: "#FFFFFF",
        canvas: "#F7F5F2",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
        soft: "0 2px 8px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        shake: {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "50%": { transform: "translateX(4px)" },
          "75%": { transform: "translateX(-4px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
