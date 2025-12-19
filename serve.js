import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mime from 'mime';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware для установки MIME-типов
app.use((req, res, next) => {
  // Явно устанавливаем MIME для критичных типов
  if (req.url.endsWith('.js') || req.url.endsWith('.js.gz')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.url.endsWith('.css') || req.url.endsWith('.css.gz')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  } else if (req.url.endsWith('.wasm')) {
    res.setHeader('Content-Type', 'application/wasm');
  }
  
  // Добавляем Content-Encoding для gzip
  if (req.url.endsWith('.gz')) {
    res.setHeader('Content-Encoding', 'gzip');
  }
  
  next();
});

// Специальный маршрут для статических файлов
app.get('/Alphearea/assets/:file', (req, res) => {
  const filePath = path.join(__dirname, 'dist', 'assets', req.params.file);
  
  // Проверяем существует ли файл
  if (fs.existsSync(filePath)) {
    const type = mime.getType(filePath);
    if (type) {
      res.setHeader('Content-Type', type);
    }
    if (filePath.endsWith('.gz')) {
      res.setHeader('Content-Encoding', 'gzip');
    }
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// Раздаём статические файлы из dist
app.use('/Alphearea', express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    const type = mime.getType(filePath);
    if (type) {
      res.setHeader('Content-Type', type);
    }
    if (filePath.endsWith('.gz')) {
      res.setHeader('Content-Encoding', 'gzip');
    }
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
  }
}));

// SPA fallback для всех маршрутов /Alphearea
app.get('/Alphearea/:path', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Обработка 404 для API маршрутов
app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Для отладки - показываем все запросы
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 Production server started on http://localhost:${PORT}/Alphearea/`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'dist')}`);
  console.log(`🔍 Check MIME types: curl -I http://localhost:${PORT}/Alphearea/assets/index-XXXXX.js`);
});