/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        teal: 'var(--teal)',
        'teal-soft': 'var(--teal-soft)',
        ivory: 'var(--ivory)',
        surface: 'var(--surface)',
        sage: 'var(--sage)',
        slate: 'var(--slate)',
        terra: 'var(--terra)',
        'terra-soft': 'var(--terra-soft)',
        lavender: 'var(--lavender)',
        ok: 'var(--ok)',
        'ok-soft': 'var(--ok-soft)',
        err: 'var(--err)',
        'err-soft': 'var(--err-soft)',
        line: 'var(--line)',
        page: 'var(--page)'
      },
      fontFamily: { sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'] },
      borderRadius: { card: '14px' },
      maxWidth: { patient: '1120px', academy: '1440px', read: '70ch' }
    }
  },
  plugins: []
};
