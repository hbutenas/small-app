const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.tsx',
    './components/**/*.tsx',
    './shared/**/*.tsx',
    './layouts/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        danger: colors.rose,
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
};
