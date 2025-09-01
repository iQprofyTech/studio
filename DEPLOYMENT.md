# 🚀 Быстрое развертывание FlowForge AI

## 📋 Перед началом

1. **Получите API ключ Google AI:**
   - Перейдите на https://aistudio.google.com/app/apikey
   - Создайте новый API ключ
   - Сохраните его для настройки

2. **Настройте переменные окружения:**
   ```bash
   # Скопируйте шаблон
   copy env.template .env.local
   
   # Отредактируйте .env.local и добавьте ваш GEMINI_API_KEY
   ```

## ⚡ Быстрый старт (3 способа)

### 1️⃣ Firebase App Hosting (Рекомендуется)
```bash
npm run deploy:firebase
```

### 2️⃣ Vercel (Самый простой)
```bash
npm run deploy:vercel
```

### 3️⃣ Docker (Локально или VPS)
```bash
npm run deploy:docker
```

## 🛠️ Детальные инструкции

### Firebase App Hosting

**Преимущества:**
- ✅ Автоматическое масштабирование
- ✅ CDN включен
- ✅ SSL сертификаты
- ✅ Интеграция с другими сервисами Google

**Шаги:**
1. Установите Firebase CLI: `npm install -g firebase-tools`
2. Войдите в аккаунт: `firebase login`
3. Запустите: `npm run deploy:firebase`

### Vercel

**Преимущества:**
- ✅ Мгновенное развертывание
- ✅ Автоматические превью
- ✅ Встроенная аналитика
- ✅ Простая настройка доменов

**Шаги:**
1. Установите Vercel CLI: `npm install -g vercel`
2. Запустите: `npm run deploy:vercel`
3. Настройте переменные окружения в Vercel Dashboard

### Docker (VPS/Dedicated)

**Преимущества:**
- ✅ Полный контроль
- ✅ Работает везде
- ✅ Легкое масштабирование
- ✅ Изоляция приложения

**Шаги:**
1. Убедитесь что Docker и Docker Compose установлены
2. Настройте `.env.local`
3. Запустите: `npm run deploy:docker`

**Управление Docker:**
```bash
npm run docker:up      # Запустить
npm run docker:down    # Остановить
npm run docker:logs    # Посмотреть логи
npm run docker:build   # Пересобрать образ
```

## 🔧 Настройка переменных окружения

### Обязательные:
- `GEMINI_API_KEY` - Ключ Google AI (получить на aistudio.google.com)

### Опциональные:
- `NEXT_PUBLIC_FIREBASE_*` - Конфигурация Firebase
- `OPENAI_API_KEY` - Для OpenAI моделей
- `STABILITY_AI_API_KEY` - Для Stable Diffusion

## 🌐 После развертывания

1. **Проверьте работоспособность:**
   - Откройте главную страницу
   - Перейдите в Dashboard
   - Протестируйте генерацию контента

2. **Мониторинг:**
   - Firebase: Firebase Console
   - Vercel: Vercel Dashboard
   - Docker: `npm run docker:logs`

## ❗ Возможные проблемы

### Ошибка "GEMINI_API_KEY not found"
- Проверьте файл `.env.local`
- Убедитесь что ключ правильный
- Для Docker проверьте `docker-compose.yml`

### Ошибки сборки TypeScript
- Проект настроен игнорировать ошибки TypeScript
- Если нужно исправить: `npm run typecheck`

### Таймауты при генерации видео
- Увеличьте `executionTimeout` в `next.config.ts`
- Для Docker увеличьте timeout в `docker-compose.yml`

## 🆘 Получить помощь

1. Проверьте логи приложения
2. Убедитесь что все переменные окружения настроены
3. Проверьте статус API ключей
4. Попробуйте локальный запуск: `npm run dev`

---

**Готово!** Ваш FlowForge AI теперь работает в облаке! 🎉
