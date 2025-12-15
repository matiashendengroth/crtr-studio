/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode color palette
        background: '#0a0a0a',
        surface: {
          DEFAULT: '#151515',
          elevated: '#1f1f1f',
          subtle: '#252525',
        },
        border: {
          DEFAULT: '#2a2a2a',
          default: '#2a2a2a',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#666666',
        },
        accent: {
          primary: '#6366f1',
          hover: '#4f46e5',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
        neutral: {
          100: '#ffffff',
          200: '#f5f5f5',
          300: '#e0e0e0',
          400: '#a0a0a0',
          500: '#666666',
          600: '#4a4a4a',
          700: '#2a2a2a',
          800: '#1f1f1f',
          900: '#151515',
        },
        // Shot type colors
        shot: {
          'ai-video': '#6366f1',
          'image-effect': '#8b5cf6',
          'motion-graphic': '#ec4899',
        },
        // Status colors
        status: {
          pending: '#f59e0b',
          generating: '#3b82f6',
          complete: '#22c55e',
          failed: '#ef4444',
        },
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
      boxShadow: {
        'accent-glow': '0 0 30px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
}



