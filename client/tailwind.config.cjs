/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
    screens: {
      'sm2': '556px',
      'sm': '640px',
      'md2': '720px',
      'md': '768px',
      'lg': '992px',
      'lg2': '1024px',
      'xl': '1200px',
      '2xl': '1536px',
      'md2': '880px',
    },
  },
  plugins: [],
}

