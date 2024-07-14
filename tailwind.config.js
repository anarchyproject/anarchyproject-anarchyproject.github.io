/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      bios: ['var(--font-bios)', 'var(--font-bios-web)', 'sans-serif'],
      sans: ['var(--font-sans)', 'var(--font-sans-web)', 'sans-serif']
    },
    screens: {
      sm: '748px',
      md: '1024px',
      lg: '1280px',
      xl: '1440px'
    },
    extend: {
      colors: {
        'red-bg': '#AA0000',
        'default-bg': '#83858C24'
      },
      boxShadow: {
        squareDefault: '8px 9px 0 0 #333'
      },
      animation: {
        blinking: 'blink 1s step-start infinite'
      },
      keyframes: {
        blink: {
          '50%': {
            color: 'transparent',
            backgroundColor: 'transparent'
          }
        }
      }
    }
  },
  plugins: []
};
