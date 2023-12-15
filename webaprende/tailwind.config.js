const withMT = require('@material-tailwind/react/utils/withMT')
module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'

  ],
  theme: {
    extend: {
      colors: {
        primary: '#8686ff',
        secondary: '#E9E9E9',
        paleta: {
          900: '#2b2b5e',
          800: '#b43a34'
        }
      }
    }
  },
  plugins: []
})
