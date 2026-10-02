/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        hero: 'var(--bg-hero)',
        footer: 'var(--bg-footer)',
        tint: 'var(--bg-category-tint)',
        media: 'var(--bg-product-media)',
        content: 'var(--text-primary)',
        muted: 'var(--text-secondary)',
        'hero-text': 'var(--text-hero)',
        'hero-sub': 'var(--text-hero-sub)',
        'category-text': 'var(--text-category)',
        'footer-text': 'var(--text-footer)',
        line: 'var(--border)',
        primary: 'var(--primary)',
        'on-primary': 'var(--on-primary)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: ['Oswald', '"Arial Narrow"', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '4px', badge: '3px' },
      borderWidth: { hairline: '0.5px' },
      maxWidth: { shell: '1200px' },
    },
  },
  plugins: [],
};
