import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        card: 'hsl(var(--card))',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #14B8A6, #06B6D4)',
        'gradient-abstract': 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, rgba(248,248,248,0) 70%)',
      },
      keyframes: {
        'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
      },
    },
  },
  plugins: [typography],
} satisfies Config

