/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.{html,ts}"],
   theme: {
      extend: {
         fontSize: {
            xxxs: ['8px', '10px'],
            xxs: ['10px', '14px'],
            '3xl': ['48px', '64px'],
            '4xl': ['82px', '120px'],
         }
      },
   },
   plugins: [],
}

