/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yugiohGold: '#FFD700',
        yugiohBlue: '#1e3a8a',
      },
    },
  },
  plugins: [],
};
