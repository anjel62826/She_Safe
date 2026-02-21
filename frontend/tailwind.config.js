module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d4408f',
        secondary: '#f28ab9',
        accent: '#7b2d7d',
        danger: '#e74c3c',
        warning: '#f39c12',
        success: '#27ae60',
        light: '#ecf0f1',
        dark: '#2c3e50'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
