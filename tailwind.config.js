/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*/*.ejs"],
  theme: {
        screens: {
      'sm': '480px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
      keyframes:{
      'openmenu':{
       '0%':{transform:'scaleY(0)'},
       '80%':{transform:'scaleY(1.2)'},
       '100%':{transform:'scaleY(1)'},
      },
    },
    animation:{
      'openmenu':'openmenu 0.5s ease-in-out forwards'
    },
    extend: {},
  },
  plugins: [],
}

