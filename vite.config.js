// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Alphearea/',        // путь к репозиторию на GitHub Pages
  server: { historyApiFallback: true }
})
