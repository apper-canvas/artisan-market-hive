/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B6F47",
        secondary: "#D4A574", 
        accent: "#E07A5F",
        surface: "#F8F6F3",
        background: "#FFFFFF",
        success: "#6B9080",
        warning: "#F4A261", 
        error: "#C1666B",
        info: "#4A7C88"
      },
      fontFamily: {
        'display': ['DM Serif Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'scale(1)' },
          '40%, 43%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1.05)' },
          '90%': { transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}