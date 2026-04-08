/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '3xl': '24px',
      },
      boxShadow: {
        'premium': '0 8px 30px rgb(0,0,0,0.04)',
      },
      colors: {
        emerald: {
          600: '#10B981',
        },
        slate: {
          400: '#94A3B8',
          600: '#475569',
          800: '#1E293B',
          900: '#0F172A',
        },
        blue: {
          600: '#2563EB',
        },
        red: {
          600: '#DC2626',
        }
      }
    },
  },
  plugins: [],
}
