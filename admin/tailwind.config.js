// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb", // rgb(37 99 235)
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        secondary: {
          50: "#f7f7f7",
          100: "#e3e3e3",
          200: "#c8c8c8",
          300: "#a4a4a4",
          400: "#818181",
          500: "#666666",
          600: "#4B4B4B", // Main brand gray
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
          950: "#0d0d0d",
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
    },
    fontFamily: {
      'body': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ],
      'sans': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ]
    }
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-responsive-xs': {
          fontSize: '0.75rem',
          '@screen sm': {
            fontSize: '0.875rem',
          },
        },
        '.text-responsive-sm': {
          fontSize: '0.875rem',
          '@screen sm': {
            fontSize: '1rem',
          },
        },
        '.text-responsive-base': {
          fontSize: '1rem',
          '@screen sm': {
            fontSize: '1.125rem',
          },
        },
        '.text-responsive-lg': {
          fontSize: '1.125rem',
          '@screen sm': {
            fontSize: '1.25rem',
          },
          '@screen md': {
            fontSize: '1.5rem',
          },
        },
        '.text-responsive-xl': {
          fontSize: '1.25rem',
          '@screen sm': {
            fontSize: '1.5rem',
          },
          '@screen md': {
            fontSize: '1.875rem',
          },
        },
        '.text-responsive-2xl': {
          fontSize: '1.5rem',
          '@screen sm': {
            fontSize: '1.875rem',
          },
          '@screen md': {
            fontSize: '2.25rem',
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
}