/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nexus-blue': '#007AFF',
        'hedral-purple': '#6366F1',
        'deep-space': '#0b0e14',
        'surface-dark': '#161b22',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      borderRadius: {
        default: '8px',
        full: '9999px',
      },
      boxShadow: {
        1: '0 4px 6px -1px rgba(0,0,0,0.3)',
        2: '0 10px 15px -3px rgba(0,0,0,0.5)',
        3: '0 20px 25px -5px rgba(0,0,0,0.7)',
      },
      fontSize: {
        display: '48px',
        h1: '32px',
        h2: '24px',
        h3: '20px',
        'body-lg': '18px',
        body: '16px',
        'body-sm': '14px',
        caption: '12px',
      },
    },
  },
  plugins: [],
};
