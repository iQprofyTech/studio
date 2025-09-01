# 🐳 Развертывание FlowForge AI через Docker

## 📋 Подготовка к развертыванию

### 1. Получите API ключи

#### 🧠 Google Gemini API (ОБЯЗАТЕЛЬНО)
1. Откройте https://aistudio.google.com/app/apikey
2. Войдите в Google аккаунт
3. Нажмите **"Create API Key"**
4. Выберите проект или создайте новый
5. Скопируйте ключ (начинается с `AIzaSy...`)

#### 🤖 OpenAI API (РЕКОМЕНДУЕТСЯ)
1. Откройте https://platform.openai.com/api-keys
2. Войдите в аккаунт или зарегистрируйтесь
3. Нажмите **"Create new secret key"**
4. Дайте имя ключу: "FlowForge AI"
5. Скопируйте ключ (начинается с `sk-...`)

⚠️ **ВАЖНО**: Сохраните ключи сразу - их нельзя будет посмотреть повторно!

### 2. Настройте переменные окружения

Откройте файл `.env.local` и добавьте ваши ключи:

```env
# Обязательно для работы приложения
GEMINI_API_KEY=AIzaSyC_ваш_реальный_ключ_здесь

# Рекомендуется для GPT-4o, GPT-4o-mini, DALL-E
OPENAI_API_KEY=sk-ваш_реальный_ключ_здесь
```

## 🚀 Развертывание

### Автоматическое развертывание
```bash
npm run deploy:docker
```

### Ручное развертывание
```bash
# 1. Соберите образ
docker-compose build

# 2. Запустите контейнер
docker-compose up -d

# 3. Проверьте статус
docker-compose ps

# 4. Посмотрите логи
docker-compose logs -f
```

## 🌐 Проверка развертывания

После успешного запуска:

1. **Откройте приложение**: http://localhost:3000
2. **Проверьте главную страницу** - должна загружаться без ошибок
3. **Перейдите в Dashboard** - интерфейс должен быть доступен
4. **Протестируйте AI генерацию**:
   - Создайте узел генерации текста
   - Попробуйте разные модели (Gemini, GPT)
   - Проверьте генерацию изображений (DALL-E)

## 🔧 Управление контейнером

### Основные команды
```bash
# Запустить
npm run docker:up

# Остановить
npm run docker:down

# Перезапустить
npm run docker:down && npm run docker:up

# Посмотреть логи
npm run docker:logs

# Пересобрать образ
npm run docker:build
```

### Обновление приложения
```bash
# 1. Остановите контейнер
npm run docker:down

# 2. Обновите код (git pull)
git pull origin main

# 3. Пересоберите и запустите
docker-compose up --build -d
```

## 📊 Мониторинг

### Проверка здоровья контейнера
```bash
# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Логи в реальном времени
docker-compose logs -f app
```

### Проверка API ключей
```bash
# Войдите в контейнер
docker-compose exec app sh

# Проверьте переменные
echo $GEMINI_API_KEY
echo $OPENAI_API_KEY
```

## 🌍 Развертывание на VPS

### Подготовка VPS
```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установите Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER
```

### Развертывание на сервере
```bash
# 1. Клонируйте проект
git clone <your-repo-url>
cd studio

# 2. Настройте переменные
cp env.template .env.local
nano .env.local  # Добавьте ваши API ключи

# 3. Запустите
docker-compose up -d

# 4. Настройте обратный прокси (Nginx)
sudo apt install nginx
# Настройте конфигурацию для проксирования на localhost:3000
```

### Пример конфигурации Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ❗ Устранение неполадок

### Контейнер не запускается
```bash
# Проверьте логи
docker-compose logs app

# Проверьте файл .env.local
cat .env.local

# Проверьте синтаксис docker-compose.yml
docker-compose config
```

### Ошибки API ключей
```bash
# Проверьте переменные в контейнере
docker-compose exec app env | grep API_KEY

# Перезапустите с новыми переменными
docker-compose down
docker-compose up -d
```

### Проблемы с портами
```bash
# Проверьте занятые порты
netstat -tulpn | grep :3000

# Измените порт в docker-compose.yml при необходимости
ports:
  - "8080:3000"  # Внешний порт 8080
```

## 💰 Оценка стоимости

### Ресурсы сервера
- **Минимум**: 1 vCPU, 1GB RAM, 20GB SSD (~$5/месяц)
- **Рекомендуется**: 2 vCPU, 2GB RAM, 40GB SSD (~$10/месяц)

### API стоимость
- **Gemini**: 15 запросов/минуту бесплатно
- **OpenAI GPT-4o-mini**: ~$0.15 за 1M токенов
- **DALL-E-3**: ~$0.040 за изображение

## 🎯 Следующие шаги

1. ✅ Получите API ключи
2. ✅ Настройте `.env.local`
3. ✅ Запустите Docker
4. ✅ Протестируйте локально
5. ✅ Разверните на VPS
6. ✅ Настройте домен и SSL

---

**🎉 Поздравляем!** Ваш FlowForge AI теперь работает в Docker! 🚀
