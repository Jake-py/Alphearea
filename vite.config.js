// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
  
export default defineConfig(({ mode }) => ({
  define: {
    'process.env': {}
  },
  
  plugins: [
    react()
  ],
  
  base: mode === 'production' ? '/Alphearea/' : '/',
  server: {
    historyApiFallback: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' blob:; style-src 'self' 'unsafe-inline' blob:; img-src 'self' data: blob:; font-src 'self' data: blob:; worker-src blob: 'self'; connect-src 'self' https://alphearea-b.onrender.com https://alphearea.onrender.com; frame-src 'none'; object-src 'none'",
    },
    proxy: {
      '/api': {
        target: 'https://alphearea-b.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log']
      }
    },
    brotliSize: false,
    
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          transformers: ['@xenova/transformers']
        }
      }
    }
  }
}))
