/** SymbiosoAi Tailwind config (starter) */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#0099FF',
            tint: '#66C7FF',
            shade: '#006FCC',
          },
          teal: {
            DEFAULT: '#00BFA5',
            tint: '#66E0C7',
            shade: '#008272',
          },
          slate: '#2F3F2F',
          silver: '#C0C0C0',
          silverTint: '#E0E0E0',
          silverShade: '#A0A0A0',
          grayTint: '#7F8F7F',
          grayShade: '#1A241A',
          black: '#0B0B0B',
          white: '#F8F8F8',
        }
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '28px',
      },
      fontFamily: {
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    }
  },
  plugins: [],
}
