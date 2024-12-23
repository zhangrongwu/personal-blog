/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // 支持暗黑模式
  theme: {
    extend: {
      colors: {
        // 自定义颜色主题
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
