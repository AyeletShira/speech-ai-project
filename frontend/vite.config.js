import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
// https://vite.dev/config/
=======
// https://vitejs.dev/config/
>>>>>>> 9635140 (Add automated tests and coverage reports for FE and BE)
export default defineConfig({
  plugins: [react()],
  // הוספנו את החלק הזה עבור הבדיקות:
  test: {
<<<<<<< HEAD
    globals: true,             // מאפשר לכתוב describe/it בלי לייבא אותם כל פעם
    environment: 'jsdom',      // מדמה דפדפן כדי שנוכל לבדוק כפתורים וכו'
    setupFiles: './src/setupTests.js', // קובץ שנגדיר תכף להרחבת היכולות
=======
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    // הגדרות דוח כיסוי (Coverage)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.jsx', 'src/**/*.js'],
      exclude: ['node_modules/', 'src/setupTests.js'],
    },
>>>>>>> 9635140 (Add automated tests and coverage reports for FE and BE)
  },
})