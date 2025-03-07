module.exports = {
  content: [
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          background: '#0a0a0a',
          foreground: '#00ff00',
          primary: '#00cc00',
          secondary: '#1a1a1a',
          accent: '#00ff66',
          destructive: '#ff3333',
          muted: '#333333',
          success: '#00ff99',
          border: '#00ff0033',
          card: '#1a1a1a',
          input: '#262626'
        },
        dark: {
          background: '#000000',
          foreground: '#00ff00',
          primary: '#00cc00',
          secondary: '#0d0d0d',
          accent: '#00ff66',
          destructive: '#ff0000',
          muted: '#1a1a1a',
          success: '#00ff99',
          border: '#00ff0066',
          card: '#0a0a0a',
          input: '#1a1a1a'
        }
      },
      boxShadow: {
        'neon-sm': '0 0 5px theme(colors.light.primary), 0 0 10px theme(colors.light.primary)',
        'neon': '0 0 10px theme(colors.light.primary), 0 0 20px theme(colors.light.primary)',
        'neon-lg': '0 0 15px theme(colors.light.primary), 0 0 30px theme(colors.light.primary)',
        'neon-xl': '0 0 20px theme(colors.light.primary), 0 0 40px theme(colors.light.primary)',
        'neon-2xl': '0 0 25px theme(colors.light.primary), 0 0 50px theme(colors.light.primary)'
      },
      borderRadius: {
        'lg': '0.5rem',
        'md': 'calc(0.5rem - 2px)',
        'sm': 'calc(0.5rem - 4px)'
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-in',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulseNeon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        glow: {
          '0%': { textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00' },
          '100%': { textShadow: '0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00' }
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px #00ff00, 0 0 30px #00ff00' },
          '50%': { opacity: '0.5', boxShadow: '0 0 10px #00ff00, 0 0 20px #00ff00' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px'
        }
      }
    },
    fontFamily: {
      sans: ['Arial', 'Helvetica', 'sans-serif'],
      mono: ['Consolas', 'Monaco', 'monospace']
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
} 