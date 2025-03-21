/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "big-shoulders": ['"Big Shoulders Stencil"', "sans-serif"], // Add your custom font here
      },
      animation: {
        shimmering: "shimmering 3s linear infinite",
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
      },
    },
  },
};
