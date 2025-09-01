# 🔑 Настройка API ключей для FlowForge AI

## 🎯 Обязательные ключи

### Google AI (Gemini) API Key ⭐ ОБЯЗАТЕЛЬНО

**Для чего нужен:** Генерация текста, анализ изображений, улучшение промптов

**Как получить:**
1. Перейдите на https://aistudio.google.com/app/apikey
2. Войдите в Google аккаунт
3. Нажмите "Create API Key"
4. Выберите существующий проект или создайте новый
5. Скопируйте ключ и добавьте в `.env.local`:
   ```
   GEMINI_API_KEY=AIzaSyC...
   ```

**Лимиты:** 15 запросов в минуту (бесплатно), до 1500 запросов в день

---

## 🔧 Опциональные ключи

### Firebase Configuration (для расширенных функций)

**Для чего нужен:** Аутентификация, база данных, файловое хранилище

**Как получить:**
1. Перейдите в [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект или выберите существующий
3. Перейдите в Project Settings > General
4. В разделе "Your apps" нажмите на веб-приложение или создайте новое
5. Скопируйте конфигурацию:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### OpenAI API Key (для дополнительных AI моделей)

**Для чего нужен:** Альтернативные модели генерации текста, DALL-E

**Как получить:**
1. Перейдите на https://platform.openai.com/api-keys
2. Войдите в аккаунт или зарегистрируйтесь
3. Нажмите "Create new secret key"
4. Скопируйте ключ:
   ```
   OPENAI_API_KEY=sk-...
   ```

**Стоимость:** От $0.002 за 1000 токенов

### Stability AI API Key (для Stable Diffusion)

**Для чего нужен:** Генерация изображений через Stable Diffusion

**Как получить:**
1. Перейдите на https://platform.stability.ai/account/keys
2. Зарегистрируйтесь и подтвердите email
3. Создайте новый API ключ
4. Добавьте в конфигурацию:
   ```
   STABILITY_AI_API_KEY=sk-...
   ```

**Стоимость:** От $0.004 за изображение

---

## 📝 Пример полного .env.local файла

```env
# Обязательно
GEMINI_API_KEY=AIzaSyC_your_actual_key_here

# Firebase (опционально)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=flowforge-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=flowforge-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=flowforge-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Дополнительные AI сервисы (опционально)
OPENAI_API_KEY=sk-your_openai_key
STABILITY_AI_API_KEY=sk-your_stability_key
```

---

## ⚡ Быстрая настройка

1. **Скопируйте шаблон:**
   ```bash
   copy env.template .env.local
   ```

2. **Получите минимум - Gemini API key:**
   - Перейдите на https://aistudio.google.com/app/apikey
   - Создайте ключ
   - Вставьте в `.env.local`

3. **Запустите проект:**
   ```bash
   npm run dev
   ```

---

## 🔒 Безопасность

- ❌ **НИКОГДА** не коммитьте `.env.local` в Git
- ✅ Используйте разные ключи для разработки и продакшена  
- ✅ Регулярно ротируйте API ключи
- ✅ Настройте ограничения по доменам в консолях API

---

## ❗ Возможные проблемы

### "GEMINI_API_KEY is not defined"
- Проверьте файл `.env.local` в корне проекта
- Убедитесь что нет пробелов вокруг знака `=`
- Перезапустите сервер разработки

### "API key is invalid"
- Проверьте правильность ключа
- Убедитесь что API включен в Google Cloud Console
- Проверьте квоты и лимиты

### "Quota exceeded"
- Проверьте лимиты в консоли API
- Подождите до сброса лимитов
- Рассмотрите переход на платный план

---

**Готово!** Теперь вы можете полноценно использовать все возможности FlowForge AI! 🚀
