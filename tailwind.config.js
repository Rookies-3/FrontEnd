import plugin from 'tailwindcss/plugin'; 

export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          fontFamily: {
            'inter': ['Inter', 'sans-serif'],
          },
          colors: {
            'github-dark': '#0d1117',
            'github-surface': '#161b22',
            'github-border': '#21262d',
            'github-text': '#c9d1d9',
            'github-text-secondary': '#8b949e',
            'github-accent': '#238636',
            'github-spring' : '#1B4D3E',
            'github-purple': '#6f42c1',
          },
          animation: {
            'float': 'float 3s ease-in-out infinite',
            'float-delayed': 'floatDelayed 3s ease-in-out infinite 0.5s',
            'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          keyframes: {
            float: {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
            floatDelayed: {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-15px)' },
            },
          },
        },
      },
      plugins: [
        // 버튼 컴포넌트를 직접 정의
        plugin(function({ addComponents }) {
            addComponents({
              '.btn-primary': {
                '@apply px-6 py-3 bg-github-accent text-white font-medium rounded-lg hover:bg-github-accent/90 transition-all duration-200 flex items-center justify-center': {},
              },
              '.btn-secondary': {
                '@apply px-6 py-3 border-2 border-github-border text-github-text font-medium rounded-lg hover:border-github-accent hover:text-github-accent transition-all duration-200 flex items-center justify-center': {},
              },
            })
          })
        ],
  }