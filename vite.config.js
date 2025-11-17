// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  base: process.env.NODE_ENV === 'production' ? '/Alphearea' : '/',        // для локальной разработки и GitHub Pages
  server: { historyApiFallback: true },
  build: {
    sourcemap: false, // отключаем eval для карт кода
    minify: 'terser', // используем terser для совместимости с CSP
    terserOptions: {
      compress: {
        pure_funcs: ['console.log'], // удаляем console.log
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
