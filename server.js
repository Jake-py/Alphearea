// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Статические файлы (JS, CSS, картинки)
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    if (filePath.endsWith('.jpg') || filePath.endsWith('.png')) res.setHeader('Content-Type', 'image/jpeg');
    if (filePath.endsWith('.jpeg')) res.setHeader('Content-Type', 'image/jpeg');
    if (filePath.endsWith('.gif')) res.setHeader('Content-Type', 'image/gif');
    if (filePath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
    if (filePath.endsWith('.woff')) res.setHeader('Content-Type', 'font/woff');
    if (filePath.endsWith('.woff2')) res.setHeader('Content-Type', 'font/woff2');
    if (filePath.endsWith('.ttf')) res.setHeader('Content-Type', 'font/ttf');
    if (filePath.endsWith('.eot')) res.setHeader('Content-Type', 'application/vnd.ms-fontobject');
  }
}));

// Корневой файл new_start.jpg
app.use('/new_start.jpg', express.static(path.join(__dirname, 'new_start.jpg'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Content-Type', 'image/jpeg');
  }
}));

// Любой другой запрос → отдаём index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => console.log(`Server started on ${port}`));