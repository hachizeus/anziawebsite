// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
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
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      animation: {
        'bg-pos-x': 'bg-pos-x 3s ease infinite',
      },
      keyframes: {
        'bg-pos-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Main brand blue
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
    },
    fontFamily: {
      body: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
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
        '.text-responsive-3xl': {
          fontSize: '1.875rem',
          '@screen sm': {
            fontSize: '2.25rem',
          },
          '@screen md': {
            fontSize: '3rem',
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
};