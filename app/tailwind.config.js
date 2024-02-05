/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html",
            "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        'navbar-blue': '#171b26',
        'light-blue': '#f2faff',
        'light-gray': '#ebebeb',
      },
    },
  },
  plugins: [],
}

