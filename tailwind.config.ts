import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // font-heading   → Plus Jakarta Sans (free Neue Montreal alt)
        heading:   ['var(--font-heading)', 'system-ui', 'sans-serif'],
        // font-paragraph → DM Sans (free General Sans alt)
        paragraph: ['var(--font-paragraph)', 'system-ui', 'sans-serif'],
        // font-label     → Space Grotesk (free, direct match)
        label:     ['var(--font-label)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // New theme palette
        'bg-primary':   '#022921',
        'bg-secondary': '#01352A',
        'text-primary': '#EEE4DA',
        'text-secondary':'#8C968D',
        accent:         '#A8874A',
        border:         '#44564C',
        hover:          '#BF9A5A',
        // Legacy aliases kept so any leftover classes don't break
        gold:           '#A8874A',
        forest:         '#01352A',
        'forest-deep':  '#022921',
        cream:          '#EEE4DA',
      },
    },
  },
  plugins: [],
};

export default config;
