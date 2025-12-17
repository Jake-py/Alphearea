import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Раздаём dist под /Alphearea
app.use('/Alphearea', express.static(path.join(__dirname, 'dist')));

// SPA fallback для всех маршрутов /Alphearea
app.get('/Alphearea', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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