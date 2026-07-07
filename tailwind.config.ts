import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // font-heading  →  var(--font-heading) injected by next/font/google
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        // font-paragraph  →  var(--font-paragraph) injected by next/font/google
        paragraph: ['var(--font-paragraph)', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: '#d4af37',
        forest: '#1a5c3a',
        'forest-deep': '#0d3320',
        cream: '#f5f1e8',
      },
    },
  },
  plugins: [],
};

export default config;
