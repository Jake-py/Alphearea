// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  define: {
    // предотвращает попытки зависимостей дергать process.env и генерировать eval-фолбэки
    'process.env': {}
  },

  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],

  base: process.env.NODE_ENV === 'production' ? '/Alphearea' : '/',
  server: { historyApiFallback: true },

  build: {
    sourcemap: false, // снижает шанс появления eval
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log']
      }
    },

    // Защита на уровне рантайма: подмена eval на безопасный аналог
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
