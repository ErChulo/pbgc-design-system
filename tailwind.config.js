/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pbgc: {
          blue: {
            900: '#001f3f',
            700: '#003366',
            600: '#035087',
            500: '#0056b3',
            100: '#e6f0fa',
            50: '#f0f6fc',
          },
          red: {
            600: '#ef3f43',
            700: '#b91c1c',
          },
          gray: {
            100: '#f8fafc',
            200: '#e2e8f0',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        }
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      ringWidth: {
        3: '3px',
      }
    },
  },
  plugins: [],
}
