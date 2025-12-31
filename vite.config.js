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
  
  base: mode === 'production' ? '/' : '/',
  server: {
    historyApiFallback: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' blob: 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' blob:; img-src 'self' data: blob:; font-src 'self' data: blob:; worker-src blob: 'self'; connect-src 'self' https://alphearea-b.onrender.com https://alphearea.onrender.com; frame-src 'none'; object-src 'none'",
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
    sourcemap: true,
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
        manualChunks: (id) => {
          // ОПТИМИЗАЦИЯ: более granular разбиение для лучшего code splitting
          
          // Выделяем vendor в отдельный чанк
          if (id.includes('node_modules/react') && !id.includes('react-router')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          
          // @xenova/transformers - отдельный lazy chunk
          // Это 8+ МБ и должен загружаться только по необходимости
          if (id.includes('@xenova/transformers')) {
            return 'transformers';
          }
          
          // Все страницы в отдельные chunks (уже используется lazy)
          if (id.includes('/pages/')) {
            const match = id.match(/\/pages\/([^\/]+)\.jsx?$/);
            if (match) {
              return `page-${match[1]}`;
            }
          }
          
          // Компоненты в отдельный чанк если тяжелые
          if (id.includes('/components/') && (
            id.includes('SmartMaterialViewer') ||
            id.includes('ChatPanel') ||
            id.includes('GraphExamples')
          )) {
            const match = id.match(/\/components\/([^\/]+)\.jsx?$/);
            if (match) {
              return `component-${match[1]}`;
            }
          }
          
          // Остальной код в main
        }
      }
    }
  }
}))
