/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["var(--font-josefin)", "sans-serif"],
    },
    colors: {
      primary: {
        100: "hsl(220, 98%, 61%)",
        200: "hsl(192, 100%, 67%)",
        300: "hsl(280, 87%, 65%)",
      },
      light: {
        100: "hsl(0, 0%, 98%)",
        200: "hsl(236, 33%, 92%)",
        300: "hsl(233, 11%, 84%)",
        400: "hsl(236, 9%, 61%)",
        500: "hsl(235, 19%, 35%)",
      },
      dark: {
        100: "hsl(235, 21%, 11%)",
        200: "hsl(235, 24%, 19%)",
        300: "hsl(234, 39%, 85%)",
        400: "hsl(236, 33%, 92%)",
        500: "hsl(234, 11%, 52%)",
        600: "hsl(233, 14%, 35%)",
        700: "hsl(237, 14%, 26%)",
      },
      white: "#fff",
      black: "#000",
    },
    extend: {
      backgroundImage: {
        "mobile-header": "url(/images/bg-mobile-light.jpg)",
        "desktop-header": "url(/images/bg-desktop-light.jpg)",
        "dark-mobile-header": "url(/images/bg-mobile-dark.jpg)",
        "dark-desktop-header": "url(/images/bg-desktop-dark.jpg)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
