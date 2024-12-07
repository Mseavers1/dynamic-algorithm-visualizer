/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        playfair: ['Playfair', 'serif'],
        oswald: ['Oswald', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      colors: {
        "wku-red": "#b01e24",
        "wkuYellow": '#F1C40F'
      },
    },
  },
  plugins: [],
}
