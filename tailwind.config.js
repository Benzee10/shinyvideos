import { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          850: '#1f2937',
          950: '#111827'
        }
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;