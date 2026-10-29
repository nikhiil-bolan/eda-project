/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-green': '#166534',
        'ev-green': '#16A34A',
        'electric-teal': '#0F766E',
        'warm-ivory': '#F5F7F4',
        'dark-text': '#17201A',
        'deep-ink': '#07111F',
        'slate-sub': '#64748B',
        'infra-amber': '#F59E0B',
        'data-blue': '#2563EB',
        'error-red': '#DC2626'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
