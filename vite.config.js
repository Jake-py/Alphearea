// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
 
export default defineConfig(({ mode }) => ({
  define: {
    'process.env': {}
  },
  
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  
  base: mode === 'production' ? '/Alphearea/' : '/',
  server: {
    historyApiFallback: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' blob:; style-src 'self' 'unsafe-inline' blob:; img-src 'self' data: blob:; font-src 'self' data: blob:; worker-src blob: 'self'; connect-src 'self' http://localhost:* ws://localhost:*; frame-src 'none'; object-src 'none'",
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    sourcemap: false, // снижает шанс появления eval
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log']
      }
    },

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          transformers: ['@xenova/transformers']
        }
      }
    }
  }
}))
