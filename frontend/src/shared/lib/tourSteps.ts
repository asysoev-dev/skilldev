import type { TourStep } from './useTour';
import { getTourRouter } from './useTour';

const openSettings = async () => {
    const { useSettingsPopover } = await import('./useSettingsPopover');
    useSettingsPopover().open();
};

const closeSettings = async () => {
    const { useSettingsPopover } = await import('./useSettingsPopover');
    useSettingsPopover().close();
};

const navigate = async (path: string) => {
    const router = getTourRouter();
    if (router && router.currentRoute.value.path !== path) {
        await router.push(path);
        await new Promise((r) => setTimeout(r, 400));
    }
};

export const tourSteps: TourStep[] = [
    {
        id: 'hero',
        title: 'Добро пожаловать!',
        text: 'Данный тур работает только на десктопной версии. Некоторые элементы могут быть не кликабельными',
        position: 'top',
        offsetY: 500,
        before: () => navigate('/'),
    },
    {
        id: 'main',
        target: '.hero',
        title: 'Главная',
        text: 'Она рендерится на сервере (SSR). Открой исходник (Ctrl+U), увидишь готовый HTML. Остальные страницы SPA',
        position: 'top',
        offsetY: 500,
        before: () => navigate('/'),
        allow: ['.tour'],
    },
    {
        id: 'theme',
        target: '.tour__step-1',
        fallbackTarget: '.header__settings',
        title: 'Тёмная тема',
        text: 'Попробуй тёмную — в ней включается космос с планетами и параллаксом',
        position: 'left',
        before: openSettings,
        after: closeSettings,
        offsetY: 100,
        offsetX: -200,
        waitFor: 500,
        allow: ['.header__settings', '.settings-popover'],
    },
    {
        id: 'parallax',
        target: '.tour__step-2',
        fallbackTarget: '.header__settings',
        title: 'Параллакс',
        text: 'Двигай мышкой — планеты и звёзды уезжают за курсором. Работает только на десктопе и только на темной теме',
        position: 'left',
        before: openSettings,
        after: closeSettings,
        offsetY: 100,
        offsetX: -200,
        waitFor: 500,
        allow: ['.header__settings', '.settings-popover'],
    },
    {
        id: 'lang',
        target: '.tour__step-3',
        fallbackTarget: '.header__settings',
        title: 'Язык',
        text: 'Переводится весь интерфейс: меню, кнопки, подписи, описания и страница входа. Выбор сохраняется в cookie и применяется на сервере при SSR',
        position: 'left',
        before: openSettings,
        after: closeSettings,
        offsetY: 100,
        offsetX: -200,
        waitFor: 500,
        allow: ['.header__settings', '.settings-popover'],
    },
    {
        id: 'skills',
        target: '.tour__step-4',
        title: 'Демо-стенды',
        text: 'Восемь стендов с живыми демо. Один из них — Data Table. Сейчас перейдём',
        position: 'top',
        offsetY: 500,
        before: () => navigate('/'),
        optional: true,
    },
    {
        id: 'table-toolbar',
        target: '.tour__step-5',
        title: 'Data Table',
        text: 'Поиск с debounce, фильтры по статусу, менеджеру и отрасли. Попробуй ввести данные',
        position: 'top',
        offsetY: -20,
        offsetX: 150,
        before: () => navigate('/demo/table'),
        waitFor: 1000,
        optional: true,
        allow: ['.demo-table__toolbar'],
    },
    {
        id: 'table-body',
        target: '.tour__step-6',
        title: 'Таблица лидов',
        text: 'Клик по колонке — сортировка. Клик по строке — модалка с деталями. Данные генерируются при деплое автоматически',
        position: 'top',
        offsetY: -20,
        offsetX: 150,
        before: () => navigate('/demo/table'),
        optional: true,
        allow: ['.data-table'],
    },
    {
        id: 'table-pagination',
        target: '.tour__step-7',
        title: 'Пагинация',
        text: 'Переключение страниц и лимита отображаемых строк',
        position: 'top',
        offsetY: -20,
        before: () => navigate('/demo/table'),
        optional: true,
        allow: ['.pagination'],
    },
    {
        id: 'export-csv',
        target: '.tour__step-8',
        title: 'CSV-экспорт',
        text: 'Выгружает текущую страницу',
        position: 'left',
        offsetY: 20,
        before: () => navigate('/demo/table'),
        optional: true,
        allow: ['.tour__step-8'],
    },
    {
        id: 'charts',
        target: '.tour__step-81',
        title: 'Charts',
        text: 'Четыре графика на Chart.js: динамика, источники, воронка продаж и конверсия менеджеров',
        position: 'top',
        offsetY: -20,
        offsetX: 150,
        before: () => navigate('/demo/charts'),
        waitFor: 1000,
        optional: true,
        allow: ['.tour__step-81'],
        noScroll: true,
    },
    {
        id: 'realtime-counter',
        target: '.tour__step-9',
        title: 'Real-time',
        text: 'Счётчик онлайн-юзеров через WebSocket. Открой вторую вкладку или наведи телефон на QR',
        position: 'top',
        offsetY: -20,
        offsetX: 220,
        before: () => navigate('/demo/realtime'),
        waitFor: 1000,
        optional: true,
    },
    {
        id: 'realtime-form',
        target: '.tour__step-10',
        title: 'Уведомления',
        text: 'Введи текст и нажми «Отправить» — уведомление прилетит во все открытые вкладки. В правом верхнем углу (исчезает через 3 секунды)',
        position: 'top',
        offsetY: -20,
        before: () => navigate('/demo/realtime'),
        optional: true,
        allow: ['.tour__step-10'],
    },
    {
        id: 'auth',
        target: '.tour__step-11',
        title: 'Авторизация',
        text: 'JWT с access-токеном в памяти и refresh в httpOnly cookie. Можешь нажать «Войти как демо-пользователь», или жми «Далее» — я залогиню сам.',
        position: 'left',
        offsetX: -20,
        before: async () => {
            // нужно разлогинить чтобы попасть на /auth
            const { useUserStore } = await import('@entities/user');
            const userStore = useUserStore();
            if (userStore.isAuthenticated) {
                try {
                    const { authApi } = await import('@shared/api/auth.api');
                    await authApi.logout();
                } catch (e) {
                    console.warn('[Tour] logout failed', e);
                }
                userStore.logout();
            }
            await navigate('/auth');
        },
        beforeNext: async () => {
            const { useUserStore } = await import('@entities/user');
            const { authApi } = await import('@shared/api/auth.api');
            const { getTourRouter } = await import('./useTour');

            const userStore = useUserStore();
            const router = getTourRouter();

            //TODO исправить! лучше вызывать из useAuth
            if (!userStore.isAuthenticated) {
                const { data } = await authApi.login({
                    email: 'demo@skilldev.ru',
                    password: 'demo123',
                });
                userStore.setToken(data.accessToken);
                userStore.setUser(data.user);
                userStore.setHydrated();
            }

            if (router && router.currentRoute.value.path !== '/dashboard') {
                await router.push('/dashboard');
            }
        },
        waitFor: 1000,
        optional: true,
        allow: ['.tour__step-111'],
    },
    {
        id: 'dashboard',
        target: '.tour__step-12',
        title: 'Админка',
        text: 'Это личный кабинет. Здесь CRUD лидов, счётчики, поиск и кнопка «Сбросить демо-данные» — только для admin.',
        position: 'top',
        offsetY: 500,
        noScroll: true,
        before: async () => {
            const { getTourRouter } = await import('./useTour');
            const router = getTourRouter();

            if (router && router.currentRoute.value.path !== '/dashboard') {
                await router.push('/dashboard');
                await new Promise((r) => setTimeout(r, 400));
            }
        },
        waitFor: 2000,
        optional: true,
    },
    {
        id: 'addLead',
        target: '.tour__step-13',
        title: 'Добавление лида',
        text: 'Можно заполнить форму, посмотреть валидацию полей и сохранить. Новая запись появится в таблице',
        position: 'left',
        offsetX: -20,
        // noScroll: true,
        before: () => navigate('/dashboard'),
        waitFor: 500,
        optional: true,
        allow: ['.tour__step-13'],
    },
    {
        id: 'editLead',
        target: '.tour__step-14',
        title: 'Изменение лида',
        text: 'Можно редактировать и удалять лида',
        position: 'left',
        offsetX: -20,
        // noScroll: true,
        before: () => navigate('/dashboard'),
        waitFor: 500,
        optional: true,
        allow: ['.tour__step-14'],
    },
    {
        id: 'resetLead',
        target: '.tour__step-15',
        title: 'Сброс',
        text: 'Пересоздает 140 лидов в БД. Использует тот же скрипт который генерирует демо-данные при деплое',
        position: 'left',
        offsetX: -20,
        // noScroll: true,
        before: () => navigate('/dashboard'),
        waitFor: 500,
        optional: true,
        allow: ['.tour__step-15'],
    },
    {
        id: 'final',
        target: '.tour__step-4',
        title: 'Это всё!',
        text: 'Не забудь посмотреть остальные демо',
        position: 'top',
        offsetY: 500,
        before: () => navigate('/'),
        optional: true,
    },
];
