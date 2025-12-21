# Настройка деплоя на Render

## 1. Создание нового статического сайта

1. Перейдите в [Render Dashboard](https://dashboard.render.com/).
2. Нажмите **New** → **Static Site**.
3. Подключите свой репозиторий (GitHub/GitLab).

## 2. Настройка сборки

- **Build Command:**
  ```bash
  npm install && npm run build
  ```

- **Publish Directory:**
  ```
  dist
  ```

## 3. Настройка окружения

- **Node Version:** Используйте версию `20` или выше.
- **Environment Variables:**
  - `NODE_ENV=production`

## 4. Дополнительные настройки

- **Auto-Deploy:** Включите для автоматического деплоя при пуше в `main`.
- **Custom Domain:** Настройте свой домен, если необходимо.

## 5. Проверка деплоя

После успешной сборки:
- Render автоматически развернёт содержимое папки `dist`.
- Все пути к файлам будут корректными (например, `/assets/index-[hash].js`).
- MIME-типы будут автоматически определены Render.

## 6. Решение проблем

- **404 Ошибки:** Убедитесь, что в `vite.config.js` указано `base: '/'`.
- **MIME-типы:** Render автоматически устанавливает правильные MIME-типы для файлов.
- **Gzip:** Отключено в `vite.config.js` (`brotliSize: false`).

## 7. Локальная проверка

Перед деплоем проверьте сборку локально:
```bash
npm run build
npx serve dist
```

Откройте `http://localhost:3000` для проверки.