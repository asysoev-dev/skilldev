# SkillDev

Проект представляет собой начальную основу полнофункционального приложения на **Vue 3** и **TypeScript** с гибридным рендерингом:

- **Главная страница** — SSR
- **Остальные разделы** — SPA

**Архитектура:**
- Frontend: Vue 3, TypeScript, Pinia, Vue Router, Webpack, FSD
- Backend: Node.js, Express, JWT, Prisma, PostgreSQL
- DevOps: Docker, Nginx, GitHub Actions, Let's Encrypt

**Ключевые возможности:**
- Авторизация через JWT + httpOnly cookies
- Полная контейнеризация (Docker Compose)
- Автоматический деплой на VPS через GitHub Actions
- HTTPS (Let's Encrypt)

## Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/asysoev-dev/skilldev.git
cd skilldev

# 2. Создать файл .env.dev в корне проекта на основе .env.example
cp .env.example .env.dev

# 3. Установить зависимости фронта
cd frontend
npm install

# 4. Создать файл backend/prisma/.env на основе backend/prisma/.env.example
cp backend/prisma/.env.example backend/prisma/.env

# 5. Установить зависимости бэка
cd ../backend
npm install

# 6. Запустить PostgreSQL в Docker (из корня)
cd ..
docker compose -f docker-compose.dev.yml up -d

# 7. Сделать миграции
cd backend
npx prisma migrate dev

# 8. Запустить бэкенд
npm run dev

# 9. Запустить фронтенд (в новом терминале)
cd ../frontend
npm run dev
```

## Команды
```bash
#Frontend
npm run dev - Запуск SPA
npm run build- Сборка для SSR (client + server)
npm run build:client - Сборка клиента
npm run build:server - Сборка сервера
npm run ssr - Запуск SSR сервера
npm run lint - Проверка кода
npm run format - Форматирование кода

#Backend
npm run dev - Запуск бэкенда
npm run build - Сборка бэкенда
npm run db:migrate - Применить миграции
npm run db:studio - Открыть Prisma Studio
```

## Деплой
```bash
# Создать GitHub Secrets для CI/CD (VPS_HOST, VPS_USER, VPS_SSH_KEY, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, VUE_API_URL)

# Деплой автоматически при пуше в main
git push origin main
```
## Доступ
Сайт: https://myskilldev.ru

## Docker
```bash
# Разработка (только PostgreSQL)
docker compose -f docker-compose.dev.yml up -d

# Продакшен (все сервисы)
docker compose -f docker-compose.prod.yml up -d

```
## Лицензия
MIT