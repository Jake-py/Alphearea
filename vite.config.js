import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Alphearea/',        // <--- добавлено для GitHub Pages
  server: { historyApiFallback: true }
})
