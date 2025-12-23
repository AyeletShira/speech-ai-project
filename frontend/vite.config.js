import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,             // Allows using describe/it without importing them
    environment: 'jsdom',      // Simulates a browser for UI testing
    setupFiles: './src/setupTests.js', 
    // Coverage reporting settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.jsx', 'src/**/*.js'],
      exclude: ['node_modules/', 'src/setupTests.js'],
    },
  },
})