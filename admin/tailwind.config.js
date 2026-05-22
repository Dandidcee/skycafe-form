/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF8F00',
        dark: '#0A0A0A',
      }
    },
  },
  plugins: [],
}
