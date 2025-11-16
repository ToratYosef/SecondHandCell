/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Scan app directory
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Scan pages directory (if used)
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Scan components directory
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Scan src directory (if used)
  ],
  theme: {
    extend: {
      colors: {
        // You can define custom colors here if needed
      },
      fontFamily: {
        // Use Next.js font variables
        sans: ['var(--font-inter)'],
        display: ['var(--font-dancing-script)'],
      },
      animation: {
        // Custom animation for scroll-triggered effects
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}