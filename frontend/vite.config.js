import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // הוספנו את החלק הזה עבור הבדיקות:
  test: {
    globals: true,             // מאפשר לכתוב describe/it בלי לייבא אותם כל פעם
    environment: 'jsdom',      // מדמה דפדפן כדי שנוכל לבדוק כפתורים וכו'
    setupFiles: './src/setupTests.js', // קובץ שנגדיר תכף להרחבת היכולות
  },
})