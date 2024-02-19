/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.html",
    "./src/**/*.js",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "navbar-blue": "#171b26",
        "light-blue": "#f2faff",
        "light-gray": "#ebebeb",
        "login-blue": "#02407f",
      },
    },
  },
  plugins: [],
};

