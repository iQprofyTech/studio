# 🎨 FlowForge AI - Каскадная генерация контента

> Визуальный редактор для создания AI-powered контента с помощью узлов и связей

FlowForge AI - это современное Next.js приложение для каскадной генерации контента с использованием искусственного интеллекта. Создавайте сложные пайплайны генерации текста, изображений, видео и аудио через интуитивный визуальный интерфейс.

## ✨ Основные возможности

- 🔤 **Генерация текста** - Google Gemini Pro/Flash LLM с фильтрацией
- 🖼️ **Генерация изображений** - Stable Diffusion SDXL, DALL-E, Vertex, Imagen
- 🎬 **Генерация видео** - ModelScope, Runway Gen 3/4, Google Veo, Kling
- 🎵 **Генерация аудио** - SUNO v3.5/v4.0, TTS сервисы
- 📁 **Управление ассетами** - Drag & drop загрузка с автоопределением типов
- 🎯 **Визуальный редактор** - Canvas 12x12 с максимум 144 узлами
- 💳 **Подписки** - Через Telegram Payments (3 бесплатные генерации)

## 🚀 Быстрый старт

> **[📋 Начните здесь](./START_HERE.md)** - Пошаговая инструкция за 5 минут

### 1. Клонирование и установка
```bash
git clone <your-repo-url>
cd studio
npm install
```

### 2. Настройка API ключей
```bash
# Скопируйте шаблон
copy env.template .env.local

# Получите ключи:
# 🧠 Gemini API: https://aistudio.google.com/app/apikey
# 🤖 OpenAI API: https://platform.openai.com/api-keys

# Добавьте в .env.local:
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

### 3. Запуск
```bash
# Для разработки
npm run dev  # http://localhost:9002

# Для продакшена (Docker)
npm run deploy:docker  # http://localhost:3000
```

## 🌐 Развертывание

### Firebase App Hosting (Рекомендуется)
```bash
npm run deploy:firebase
```

### Vercel (Самый простой)
```bash
npm run deploy:vercel
```

### Docker (VPS/Dedicated)
```bash
npm run deploy:docker
```

**Подробные инструкции:** См. [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔑 Настройка API ключей

**Подробное руководство:** См. [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)

**Доступные AI модели:**
- 🧠 **Google Gemini** - Текст, изображения, видео, аудио (бесплатно)
- 🤖 **OpenAI GPT-4o/4o-mini** - Продвинутая генерация текста
- 🎨 **DALL-E-3** - Высококачественные изображения
- 🔥 **Firebase** - Аутентификация, хранилище (опционально)

## 🛠️ Разработка

### Доступные команды
```bash
npm run dev          # Запуск в режиме разработки
npm run genkit:dev   # Запуск Genkit в режиме разработки
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен версии
npm run typecheck    # Проверка типов TypeScript
```

### Структура проекта
```
src/
├── ai/                 # AI логика и flows
│   ├── flows/         # Genkit flows для разных типов генерации
│   ├── genkit.ts      # Конфигурация Genkit
│   └── dev.ts         # Dev сервер для Genkit
├── app/               # Next.js App Router
│   ├── dashboard/     # Главный интерфейс
│   └── page.tsx       # Главная страница
├── components/        # React компоненты
│   ├── dashboard/     # Компоненты дашборда
│   └── ui/           # UI библиотека (Radix UI)
└── lib/              # Утилиты и хелперы
```

## 🎨 Дизайн система

- **Основной цвет:** Насыщенный фиолетовый (#9400D3)
- **Фон:** Светло-десатурированный фиолетовый (#E6E0EB)  
- **Акцент:** Аналогичный синий (#4682B4)
- **Шрифт:** Inter (sans-serif)
- **Стиль:** Liquid glass / стекломорфизм с мягкими тенями
- **Иконки:** Lucide React
- **Анимации:** Framer Motion для плавных переходов

## 🔧 Технологический стек

- **Framework:** Next.js 15.3.3 с App Router
- **AI:** Google AI Genkit с Gemini моделями
- **UI:** React 18 + Radix UI + Tailwind CSS
- **Визуальный редактор:** React Flow
- **База данных:** Firebase (опционально)
- **Развертывание:** Firebase App Hosting, Vercel, Docker
- **Язык:** TypeScript

## 📊 Мониторинг и аналитика

- **Firebase:** Встроенная аналитика и мониторинг
- **Vercel:** Dashboard с метриками производительности
- **Docker:** Логирование через Docker Compose

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature ветку: `git checkout -b feature/amazing-feature`
3. Коммитьте изменения: `git commit -m 'Add amazing feature'`
4. Push в ветку: `git push origin feature/amazing-feature`
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для подробностей.

## 🆘 Поддержка

- 📚 [Документация по развертыванию](./DEPLOYMENT.md)
- 🔑 [Настройка API ключей](./API_KEYS_SETUP.md)
- 🐛 [Создать issue](../../issues)
- 💬 [Обсуждения](../../discussions)

---

**Создано с ❤️ для творчества с помощью ИИ**
