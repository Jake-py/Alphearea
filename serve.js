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
  } else if (req.url.endsWith('.jpg') || req.url.endsWith('.jpeg') || req.url.endsWith('.png') || req.url.endsWith('.gif')) {
    res.setHeader('Content-Type', 'image/jpeg');
  }
  
  // Добавляем Content-Encoding для gzip
  if (req.url.endsWith('.gz')) {
    res.setHeader('Content-Encoding', 'gzip');
  }
  
  next();
});

// Обработка 404 для API маршрутов
app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Раздаём статические файлы из dist с префиксом /Alphearea
app.use('/Alphearea', express.static(path.join(process.cwd(), 'dist'), {
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
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

// SPA fallback для всех маршрутов (должен быть после всех статических маршрутов)
app.use((req, res) => {
  if (!req.url.startsWith('/Alphearea')) {
    res.redirect('/Alphearea/');
  } else {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  }
});

// Для отладки - показываем все запросы
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 Production server started on http://localhost:${PORT}/`);
  console.log(`📁 Serving files from: ${path.join(process.cwd(), 'dist')}`);
  console.log(`🔍 Check MIME types: curl -I http://localhost:${PORT}/Alphearea/assets/index.css`);
});