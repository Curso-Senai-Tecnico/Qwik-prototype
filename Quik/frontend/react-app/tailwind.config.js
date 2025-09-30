/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        space: ['"Space Mono"', "monospace"],
        inter: ['"Inter"', "sans-serif"],
        roboto: ['"Roboto Serif"', "serif"],
      },
    },
  },
  plugins: [],
};
