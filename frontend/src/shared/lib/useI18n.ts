import { ref, onMounted } from 'vue';

export type Lang = 'ru' | 'en';

const KEY = 'portfolioLang';

const messages: Record<Lang, Record<string, string>> = {
    ru: {
        // Nav
        'nav.home': 'Главная',
        'nav.auth': 'Вход',
        'nav.dashboard': 'Dashboard',
        'nav.menu': 'Меню',

        // Controls
        'controls.theme': 'Тема',
        'controls.parallax': 'Параллакс',
        'controls.lang': 'Язык',

        // Footer
        'footer.rights': 'Все права защищены',
        'footer.github': 'GitHub',
        'footer.resume': 'Резюме на hh.ru',
        'footer.telegram': 'Telegram',
        'footer.email': 'Email',

        // Hero
        'hero.title.role': 'разработчик',
        'hero.title.frontend': 'Frontend-',
        'hero.subtitle': 'Меня зовут Алексей. 5+ лет опыта в коммерческой разработке. Пишу на Vue 3 и TypeScript, бэкенд — на Node.js. Работал над B2B-системами, IoT и e-commerce. Этот сайт сделан с нуля: SSR, Docker, JWT, WebSocket. Исходники — на GitHub.',
        'hero.cta.tour': 'Тур по сайту',
        'hero.cta.demo': 'Демо',
        'hero.cta.github': 'GitHub',

        // SkillGrid
        'skills.title': 'Демо-стенды',
        'skills.subtitle': 'Мой стек — в живом коде.',
        'skills.frontend.title': 'Frontend',
        'skills.frontend.description': 'Vue 3, TypeScript, SCSS, Pinia, Composition API',
        'skills.fullstack.title': 'Fullstack',
        'skills.fullstack.description': 'Node.js, Express, Prisma, PostgreSQL, JWT',
        'skills.devops.title': 'DevOps',
        'skills.devops.description': 'Docker, Nginx, GitHub Actions, Let’s Encrypt',
        'skills.ssr.title': 'SSR',
        'skills.ssr.description': 'Свой SSR на Express, гидратация, SEO',
        'skills.realtime.title': 'Real-time',
        'skills.realtime.description': 'WebSocket, socket.io, online-юзеры',
        'skills.ui-kit.title': 'UI-кит',
        'skills.ui-kit.description': 'Кнопки, инпуты, чекбоксы, свитчи, теги',
        'skills.charts.title': 'Charts',
        'skills.charts.description': 'Chart.js, воронка, аналитика, графики',
        'skills.table.title': 'Data Table',
        'skills.table.description': 'Поиск, сортировка, фильтры, пагинация, CSV',

        // Auth
        'auth.login': 'Вход',
        'auth.register': 'Регистрация',
        'auth.login.subtitle': 'Демо-доступ к админке портфолио',
        'auth.register.subtitle': 'Создай аккаунт для управления лидами',
        'auth.name': 'Имя',
        'auth.email': 'Email',
        'auth.password': 'Пароль',
        'auth.submit.login': 'Войти',
        'auth.submit.register': 'Зарегистрироваться',
        'auth.divider': 'или',
        'auth.demo': 'Войти как демо-пользователь',
        'auth.demo.hint': 'Демо-аккаунт с правами admin. Все данные вымышленные.',

        // Common
        'common.back': 'К стендам',
    },
    en: {
        // Nav
        'nav.home': 'Home',
        'nav.auth': 'Sign in',
        'nav.dashboard': 'Dashboard',
        'nav.menu': 'Menu',

        // Controls
        'controls.theme': 'Theme',
        'controls.parallax': 'Parallax',
        'controls.lang': 'Language',

        // Footer
        'footer.rights': 'All rights reserved',
        'footer.github': 'GitHub',
        'footer.resume': 'Resume on hh.ru',
        'footer.telegram': 'Telegram',
        'footer.email': 'Email',

        // Hero
        'hero.title.role': 'developer',
        'hero.title.frontend': 'Frontend ',
        'hero.subtitle': 'My name is Alexey. 5+ years of commercial experience. I code in Vue 3 and TypeScript, backend — in Node.js. Worked on B2B systems, IoT and e-commerce. This site was built from scratch: SSR, Docker, JWT, WebSocket. Source code — on GitHub.',
        'hero.cta.tour': 'Take a tour',
        'hero.cta.demo': 'Demo',
        'hero.cta.github': 'GitHub',

        // SkillGrid
        'skills.title': 'Demo stands',
        'skills.subtitle': 'My stack in working code.',
        'skills.frontend.title': 'Frontend',
        'skills.frontend.description': 'Vue 3, TypeScript, SCSS, Pinia, Composition API',
        'skills.fullstack.title': 'Fullstack',
        'skills.fullstack.description': 'Node.js, Express, Prisma, PostgreSQL, JWT',
        'skills.devops.title': 'DevOps',
        'skills.devops.description': 'Docker, Nginx, GitHub Actions, Let’s Encrypt',
        'skills.ssr.title': 'SSR',
        'skills.ssr.description': 'Custom SSR on Express, hydration, SEO',
        'skills.realtime.title': 'Real-time',
        'skills.realtime.description': 'WebSocket, socket.io, online users',
        'skills.ui-kit.title': 'UI kit',
        'skills.ui-kit.description': 'Buttons, inputs, checkboxes, switches, tags',
        'skills.charts.title': 'Charts',
        'skills.charts.description': 'Chart.js, funnel, analytics, graphs',
        'skills.table.title': 'Data Table',
        'skills.table.description': 'Search, sort, filters, pagination, CSV',

        // Auth
        'auth.login': 'Sign in',
        'auth.register': 'Sign up',
        'auth.login.subtitle': 'Demo access to portfolio admin',
        'auth.register.subtitle': 'Create an account to manage leads',
        'auth.name': 'Name',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.submit.login': 'Sign in',
        'auth.submit.register': 'Sign up',
        'auth.divider': 'or',
        'auth.demo': 'Sign in as demo user',
        'auth.demo.hint': 'Demo account with admin rights. All data is fictional.',

        // Common
        'common.back': 'Back to stands',
    },
};

const lang = ref<Lang>('ru');

export function setServerLang(value: Lang) {
    lang.value = value;
}

export function useI18n() {
    const t = (key: string): string => messages[lang.value][key] ?? key;

    const setLang = (value: Lang) => {
        lang.value = value;
        localStorage.setItem(KEY, value);
        document.cookie = `${KEY}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        document.documentElement.lang = value;
    };

    const toggleLang = () => setLang(lang.value === 'ru' ? 'en' : 'ru');

    onMounted(() => {
        const saved = localStorage.getItem(KEY) as Lang | null;
        if (saved === 'ru' || saved === 'en') {
            lang.value = saved;
            document.documentElement.lang = saved;
        }
    });

    return { lang, t, setLang, toggleLang };
}
