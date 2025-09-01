# ⚙️ Настройка переменных окружения

## 🚀 Быстрая настройка

### 1. Создайте файл .env.local
```bash
# Скопируйте шаблон
copy env.template .env.local
```

### 2. Получите API ключи

#### 🧠 Google Gemini API (ОБЯЗАТЕЛЬНО)
1. Перейдите на https://aistudio.google.com/app/apikey
2. Войдите в Google аккаунт
3. Нажмите "Create API Key"
4. Скопируйте ключ и добавьте в `.env.local`:
```env
GEMINI_API_KEY=AIzaSyC_your_actual_key_here
```

#### 🤖 OpenAI API (РЕКОМЕНДУЕТСЯ)
1. Перейдите на https://platform.openai.com/api-keys
2. Войдите в аккаунт или зарегистрируйтесь
3. Нажмите "Create new secret key"
4. Скопируйте ключ и добавьте в `.env.local`:
```env
OPENAI_API_KEY=sk-your_actual_key_here
```

### 3. Пример готового .env.local
```env
# Обязательно - для всех AI функций
GEMINI_API_KEY=AIzaSyC_your_actual_gemini_key_here

# Рекомендуется - для GPT-4o, DALL-E
OPENAI_API_KEY=sk-your_actual_openai_key_here

# Firebase (опционально)
# NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
# NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 🔍 Проверка настройки

### Локальный тест
```bash
# Запустите проект
npm run dev

# Откройте http://localhost:9002
# Проверьте работу AI генерации
```

### Проверка переменных
```bash
# В PowerShell
echo $env:GEMINI_API_KEY
echo $env:OPENAI_API_KEY
```

## 🐳 Для Docker развертывания

### 1. Убедитесь что .env.local создан
```bash
# Проверьте наличие файла
dir .env.local

# Проверьте содержимое
type .env.local
```

### 2. Docker автоматически загрузит переменные
```bash
# Docker Compose загружает .env.local автоматически
npm run deploy:docker
```

## ❗ Частые ошибки

### "GEMINI_API_KEY is not defined"
- ✅ Проверьте файл `.env.local` в корне проекта
- ✅ Убедитесь что нет пробелов: `GEMINI_API_KEY=key` (не `GEMINI_API_KEY = key`)
- ✅ Перезапустите сервер: `Ctrl+C` → `npm run dev`

### "OpenAI API key is not configured"
- ✅ Добавьте `OPENAI_API_KEY=sk-...` в `.env.local`
- ✅ Проверьте что ключ активен в OpenAI Dashboard

### "Docker не видит переменные"
- ✅ Убедитесь что `.env.local` в корне проекта
- ✅ Перезапустите контейнер: `npm run docker:down` → `npm run docker:up`

### "API key is invalid"
- ✅ Проверьте правильность ключа (скопируйте заново)
- ✅ Убедитесь что API включен в консоли
- ✅ Проверьте квоты и биллинг

## 💡 Советы по безопасности

### ✅ Что делать
- Используйте `.env.local` для локальной разработки
- Настройте переменные в панели управления хостинга для продакшена
- Регулярно ротируйте API ключи
- Настройте ограничения по доменам/IP

### ❌ Что НЕ делать
- НЕ коммитьте `.env.local` в Git
- НЕ передавайте ключи в URL или клиентском коде
- НЕ используйте одни ключи для разработки и продакшена
- НЕ оставляйте неограниченные ключи

## 🌐 Развертывание на разных платформах

### Firebase App Hosting
```bash
# Настройте переменные в Firebase Console
firebase functions:config:set gemini.api_key="your_key"
firebase functions:config:set openai.api_key="your_key"
```

### Vercel
```bash
# Настройте в Vercel Dashboard → Settings → Environment Variables
# Или через CLI:
vercel env add GEMINI_API_KEY
vercel env add OPENAI_API_KEY
```

### Docker/VPS
```bash
# Используйте .env.local или переменные системы
export GEMINI_API_KEY="your_key"
export OPENAI_API_KEY="your_key"
```

---

**🎉 Готово!** После настройки переменных ваш FlowForge AI будет иметь доступ ко всем AI моделям!
