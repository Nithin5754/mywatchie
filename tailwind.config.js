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
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      },
      fontFamily: {
        'body': [
      'Inter', 
      'ui-sans-serif', 
      'system-ui', 
      '-apple-system', 
      'system-ui', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'Noto Sans', 
      'sans-serif', 
      'Apple Color Emoji', 
      'Segoe UI Emoji', 
      'Segoe UI Symbol', 
      'Noto Color Emoji'
    ],
        'sans': [
      'Inter', 
      'ui-sans-serif', 
      'system-ui', 
      '-apple-system', 
      'system-ui', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'Noto Sans', 
      'sans-serif', 
      'Apple Color Emoji', 
      'Segoe UI Emoji', 
      'Segoe UI Symbol', 
      'Noto Color Emoji'
    ]
      }
    },
  },
  plugins: [],
};
