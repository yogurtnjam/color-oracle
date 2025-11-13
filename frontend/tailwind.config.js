/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          forest: '#2D5016',
          moss: '#4A7C23',
          leaf: '#6BA539',
          sky: '#87CEEB',
          ocean: '#4A90A4',
          earth: '#8B7355',
          sand: '#C2B280',
          sunrise: '#FFB347',
          sunset: '#FF6B6B',
        }
      },
      backgroundImage: {
        'gradient-nature': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-forest': 'linear-gradient(135deg, #2D5016 0%, #6BA539 100%)',
        'gradient-sky': 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)',
      }
    },
  },
  plugins: [],
}