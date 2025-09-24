/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#71b127',
        secondary: '#e9e9e9',
        'secondary-200': '#d4d4d4',
        'primary-text': '#ffffff',
        'secondary-text': '#000000',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-inverse': 'var(--text-inverse)',
        background: 'var(--background)',
        'background-alt': 'var(--background-alt)',
        'background-dark': 'var(--background-dark)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        'border-light': 'var(--border-light)',
      },
    },
  },
  plugins: [],
}
