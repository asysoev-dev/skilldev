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
        'hero.subtitle.1':
            'Меня зовут Алексей. Я фронтенд-разработчик с пятилетним стажем в коммерческой разработке. Пишу сложные интерфейсы на Vue 3 и TypeScript. Также есть опыт на бэкенде (Node.js). Работал в B2B (медицина), IoT и e-commerce.',
        'hero.subtitle.2': 'Собрал этот сайт как единый проект для демонстрации своих навыков.',
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

        // About
        'about.title': 'Обо мне',
        'about.subtitle': 'Коротко — без дат и компаний.',
        'about.bio.1':
            'Меня зовут Алексей. Frontend / Fullstack разработчик с 5+ годами коммерческого опыта.',
        'about.bio.2':
            'Специализируюсь на Vue 3 + TypeScript. Работал над B2B-системами, IoT-платформами и e-commerce. Умею писать код, ревьюить, документировать и деплоить.',
        'about.bio.3':
            'Верю, что хороший интерфейс — это быстро, надёжно и удобно. Исходники этого сайта открыты на GitHub.',

        'about.principles.title': 'Принципы',
        'about.principle.clean.title': 'Чистый код',
        'about.principle.clean.text':
            'Читаемый, типизированный, с понятной архитектурой. Без магии.',
        'about.principle.performance.title': 'Производительность',
        'about.principle.performance.text':
            'Быстрая загрузка, минимум запросов, разумный рендеринг.',
        'about.principle.docs.title': 'Документация',
        'about.principle.docs.text': 'Комментарии там, где нужно. README, JSDoc, Confluence.',
        'about.principle.learning.title': 'Постоянное обучение',
        'about.principle.learning.text':
            'Учусь на ИТ-направлении с уклоном в ИИ. Слежу за трендами.',

        'about.stack.title': 'Стек',
        'about.stack.frontend': 'Frontend',
        'about.stack.backend': 'Backend',
        'about.stack.infra': 'Инфраструктура',

        'about.contacts.title': 'Контакты',
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
        'hero.subtitle.1':
            'My name is Alexey. I am a frontend developer with five years of commercial experience. I build complex interfaces with Vue 3 and TypeScript. I also have backend experience (Node.js). Worked in B2B (healthcare), IoT and e-commerce.',
        'hero.subtitle.2': 'I built this site as a single project to showcase my skills.',
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

        // About
        'about.title': 'About',
        'about.subtitle': 'Briefly — without dates or companies.',
        'about.bio.1':
            'My name is Alexey. Frontend / Fullstack developer with 5+ years of commercial experience.',
        'about.bio.2':
            'I specialize in Vue 3 + TypeScript. Worked on B2B systems, IoT platforms and e-commerce. I can code, review, document and deploy.',
        'about.bio.3':
            'I believe a good interface is fast, reliable and convenient. The source code of this site is open on GitHub.',

        'about.principles.title': 'Principles',
        'about.principle.clean.title': 'Clean code',
        'about.principle.clean.text': 'Readable, typed, with a clear architecture. No magic.',
        'about.principle.performance.title': 'Performance',
        'about.principle.performance.text': 'Fast load, minimal requests, sane rendering.',
        'about.principle.docs.title': 'Documentation',
        'about.principle.docs.text': 'Comments where needed. README, JSDoc, Confluence.',
        'about.principle.learning.title': 'Continuous learning',
        'about.principle.learning.text': 'Studying IT with a focus on AI. Following trends.',

        'about.stack.title': 'Stack',
        'about.stack.frontend': 'Frontend',
        'about.stack.backend': 'Backend',
        'about.stack.infra': 'Infrastructure',

        'about.contacts.title': 'Contacts',
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
