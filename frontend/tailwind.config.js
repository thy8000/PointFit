/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './index.ts',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e',
          dark: '#16a34a',
        },
        surface: {
          DEFAULT: '#1e293b',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}