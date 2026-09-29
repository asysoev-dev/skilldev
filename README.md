# SkillDev

Сайт-портфолио. Собран как единый проект: SSR на главной, SPA в остальных разделах, живой бэкенд, авторизация, деплой через CI/CD.

Сайт: https://myskilldev.ru

## Что внутри

Главная страница рендерится на сервере. SSR собственный: Express + Vue, без Nuxt. Остальные разделы работают как обычное SPA на Vue Router. Такой гибрид дает быстрый первый рендер и нормальное SEO для главной, а остальные страницы не грузят сервер без необходимости.

Демо-разделы:

- `/demo/table` таблица на 140 лидов. Поиск, фильтры, сортировка, пагинация, экспорт в CSV.
- `/demo/charts` четыре графика на Chart.js: динамика, источники, воронка, конверсия менеджеров.
- `/demo/realtime` WebSocket через socket.io. Счетчик онлайн-пользователей и уведомления между вкладками.
- `/demo/ui` витрина UI-кита. Кнопки, инпуты, чекбоксы, свитчи, карточки, теги.
- `/auth` вход и регистрация. JWT с access-токеном в памяти и refresh в httpOnly cookie.
- `/dashboard` CRUD лидов с валидацией форм, роли admin/user.

Демо-доступ: `demo@skilldev.ru` / `demo123`. Данные вымышленные, можно сбросить кнопкой в дашборде.

## Стек

**Frontend:** Vue 3 (Composition API), TypeScript, Pinia, Vue Router, SCSS, Webpack, VeeValidate + Zod, Chart.js, socket.io-client

**Backend:** Node.js, Express, Prisma, PostgreSQL, JWT, socket.io

**Инфраструктура:** Docker Compose, Nginx, GitHub Actions, Let's Encrypt

**Архитектура:** FSD

## Запуск локально

Нужны Node.js 20+, Docker и PostgreSQL (поднимается через Docker Compose).

```bash
# 1. Клонировать
git clone https://github.com/asysoev-dev/skilldev.git
cd skilldev

# 2. Скопировать env-файлы
cp .env.example .env.dev
cp backend/prisma/.env.example backend/prisma/.env

# 3. Установить зависимости
cd frontend && npm install
cd ../backend && npm install

# 4. Поднять PostgreSQL
cd ..
docker compose -f docker-compose.dev.yml up -d

# 5. Применить миграции и засидить данные
cd backend
npx prisma migrate dev
npm run db:seed

# 6. Запустить бэкенд
npm run dev

# 7. В новом терминале запустить фронтенд
cd ../frontend
npm run dev

```

## Деплой
```bash
# Создать GitHub Secrets для CI/CD (VPS_HOST, VPS_USER, VPS_SSH_KEY, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, VUE_API_URL)

# Деплой автоматически при пуше в main
git push origin main
```

## Docker
```bash
# Разработка (только PostgreSQL)
docker compose -f docker-compose.dev.yml up -d

# Продакшен (все сервисы)
docker compose -f docker-compose.prod.yml up -d

```
## Лицензия
MIT