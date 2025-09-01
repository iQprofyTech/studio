# Руководство по развертыванию FlowForge AI

## Обзор проекта
FlowForge AI - это Next.js приложение для каскадной генерации контента с использованием AI. Проект использует Google AI Genkit, React Flow для визуального редактора и Firebase для хостинга.

## Необходимые переменные окружения

Создайте файл `.env.local` в корне проекта со следующими переменными:

```env
# Google AI API Key (обязательно)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (если используете Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Дополнительные AI сервисы (по необходимости)
OPENAI_API_KEY=your_openai_key_if_needed
STABILITY_AI_API_KEY=your_stability_key_if_needed
```

## Варианты развертывания

### 1. Firebase App Hosting (Рекомендуется)

Проект уже настроен для Firebase App Hosting:

1. **Установите Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Войдите в Firebase:**
   ```bash
   firebase login
   ```

3. **Инициализируйте проект:**
   ```bash
   firebase init hosting
   ```

4. **Настройте переменные окружения в Firebase:**
   ```bash
   firebase functions:config:set gemini.api_key="your_api_key"
   ```

5. **Деплой:**
   ```bash
   npm run build
   firebase deploy
   ```

### 2. Vercel (Простое развертывание)

1. **Установите Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Деплой:**
   ```bash
   vercel
   ```

3. **Настройте переменные окружения в Vercel Dashboard**

### 3. VPS/Dedicated сервер с Docker

Создайте `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Создайте `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

### 4. Railway/Render (Альтернативные платформы)

Проект совместим с Railway и Render. Просто подключите GitHub репозиторий и настройте переменные окружения.

## Настройка API ключей

### Google AI (Gemini) API Key
1. Перейдите в [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Создайте новый API ключ
3. Добавьте его в переменные окружения как `GEMINI_API_KEY`

### Firebase (если используете)
1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Получите конфигурацию из настроек проекта
3. Добавьте все необходимые переменные

## Команды для разработки

```bash
# Запуск в режиме разработки
npm run dev

# Запуск Genkit в режиме разработки
npm run genkit:dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start

# Проверка типов
npm run typecheck
```

## Проверка развертывания

После развертывания проверьте:

1. ✅ Главная страница загружается
2. ✅ Dashboard доступен
3. ✅ Genkit API работает
4. ✅ Переменные окружения настроены корректно
5. ✅ AI генерация функционирует

## Возможные проблемы

1. **Ошибки TypeScript**: Проект настроен игнорировать ошибки сборки (`ignoreBuildErrors: true`)
2. **Размер файлов**: Server Actions настроены на 4.5MB (`bodySizeLimit`)
3. **Таймауты**: Execution timeout установлен на 120 секунд для видео генерации

## Мониторинг и логи

- Firebase: используйте Firebase Console для мониторинга
- Vercel: встроенная аналитика и логи
- VPS: настройте логирование через Docker или systemd
