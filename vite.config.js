// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/Alphearea/' : '/',        // путь к репозиторию на GitHub Pages
  server: { historyApiFallback: true },
  build: {
    sourcemap: false // отключаем eval для карт кода
  }
})
