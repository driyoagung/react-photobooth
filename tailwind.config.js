// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '50%': { transform: 'scale(1.1)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        'bounce-in': 'bounce-in 0.6s ease',
      },
    },
  },
  plugins: [],
}
