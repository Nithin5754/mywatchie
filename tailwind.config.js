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
    extend: {
      width: {
        'custom-width-10': '10rem',
        'custom-width-15': '15rem',
        'custom-width-20': '20rem',
      },
    },
  },
  plugins: [],
};
