/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        secondary: "#e3beb8",
        primary: "#c9c6c5",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c4c7c7",
        background: "#141313",
        accent: "#FF8F00"
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
