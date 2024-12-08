/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'radial-noise': `
          radial-gradient(circle, rgba(0, 0, 0, 0.1) 20%, transparent 6%),
          radial-gradient(circle, rgba(0, 0, 0, 0.2) 30%, transparent 10%),
          radial-gradient(circle, rgba(0, 0, 0, 0.2) 40%, transparent 3%),
          radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, transparent 6%),
          radial-gradient(circle, rgba(0, 0, 0, 0.1) 60%, transparent 10%)
        `,
        'grainy-noise': `
          linear-gradient(0deg, rgba(0, 0, 0, 0.1) 2px, transparent 2px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.1) 2px, transparent 2px),
          linear-gradient(45deg, rgba(0, 0, 0, 0.1) 2px, transparent 2px),
          linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 2px, transparent 2px)
        `,
      },
      backgroundSize: {
        'grainy-size': '10px 10px',
      },
      backgroundPosition: {
        'grainy-position': '0 0',
      },
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
      letterSpacing: {
        'widest-two': '0.20em',
      }
    },
  },
  plugins: [],
}
