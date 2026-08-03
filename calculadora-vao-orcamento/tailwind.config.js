/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ink-navy':      '#10131C',
        'linen':         '#F4EFE6',
        'thread-gold':   '#B8934A',
        'stitch-brick':  '#B5503E',
        'sage-open':     '#7C8B6F',
        'charcoal-text': '#2B2620',
        'paper-white':   '#FDFCFA',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

