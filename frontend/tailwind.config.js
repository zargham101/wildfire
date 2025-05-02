/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "big-shoulders": ['"Big Shoulders Stencil"', "sans-serif"], 
      },
      animation: {
        shimmering: "shimmering 3s linear infinite",
        drawCircle: 'drawCircle 5s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        shimmering: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        drawCircle: {
          '0%': {
            transform: 'scale(0)',  // Circle starts small
            opacity: 0.2,            // Initially very transparent
          },
          '100%': {
            transform: 'scale(1)',  // Circle grows to full size
            opacity: 1,              // Fully visible
          },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
};
