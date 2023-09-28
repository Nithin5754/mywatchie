/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*/*.ejs'],
  theme: {
    keyframes: {
      openmenu: {
        '0%': { transform: 'scaleY(0)' },
        '80%': { transform: 'scaleY(1.2)' },
        '100%': { transform: 'scaleY(1)' },
      },
    },
    animation: {
      openmenu: 'openmenu 0.5s ease-in-out forwards',
    },
    extend: {},
  },
  plugins: [],
};
