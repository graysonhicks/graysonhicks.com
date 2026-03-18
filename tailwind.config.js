/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0a0f',
          dark: '#0d0d1a',
          panel: '#111128',
          cyan: '#00ffff',
          magenta: '#ff00ff',
          green: '#00ff41',
          yellow: '#ffff00',
          orange: '#ff6600',
          red: '#ff0044',
          pink: '#ff69b4',
          blue: '#0066ff',
          purple: '#9900ff',
          dim: '#1a1a3e',
        },
      },
      fontFamily: {
        mono: ['"VT323"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 2s infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'text-shadow-pulse': 'text-shadow-pulse 3s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)' },
        },
        'text-shadow-pulse': {
          '0%, 100%': { textShadow: '0 0 4px rgba(0, 255, 255, 0.5)' },
          '50%': { textShadow: '0 0 8px rgba(0, 255, 255, 0.8), 0 0 16px rgba(0, 255, 255, 0.4)' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(0, 255, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 255, 255, 0.7)' },
        },
      },
    },
  },
  plugins: [],
}
