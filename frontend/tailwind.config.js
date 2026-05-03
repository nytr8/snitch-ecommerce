/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1C1E",
        secondary: "#D9C5D2",
        tertiary: "#8D6A5D",
        neutral: "#F9F9F8",
        dark: "#2A2A2A",
        accent: "#C5B8A3",
      },
      fontFamily: {
        serif: ["Noto Serif", "serif"],
        sans: ["Manrope", "sans-serif"],
      },
      fontSize: {
        headline: ["32px", "40px"],
        body: ["16px", "24px"],
        label: ["14px", "20px"],
      },
    },
  },
  plugins: [],
};
