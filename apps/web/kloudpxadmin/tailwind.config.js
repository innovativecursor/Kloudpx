/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx}", "./src/**/*"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "login-img": "url('./src/assets/Images/background.jpg')",
      },
      fontFamily: {
        gill: ["Gill Sans, Gill Sans MT, Calibri, Trebuchet MS, sans-serif"],
      },
      screens: {
        sm: "374",
        // => @media (min-width: 576px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "992px",
        // => @media (min-width: 992px) { ... }

        xl: "1200px",
        // => @media (min-width: 1200px) { ... }
      },
      letterSpacing: {
        tightest: "-.075em",
        tighter: "-.05em",
        tight: "-.025em",
        normal: "0",
        wide: "1px",
        wider: "2px",
        widest: "3px",
        widest: "4px",
      },
      backgroundColor: {
        homexbg: "#0070BA",
      },
      textColor: {
        highlight: "#0070BA",
      },
    },
  },
  plugins: [],
};
