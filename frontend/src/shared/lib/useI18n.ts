import { ref, computed, onMounted } from 'vue';

export type Lang = 'ru' | 'en';

const KEY = 'portfolioLang';

const messages: Record<Lang, Record<string, string>> = {
    ru: {
        'nav.home': 'Главная',
        'nav.auth': 'Вход',
        'nav.dashboard': 'Dashboard',
        'nav.menu': 'Меню',
        'controls.theme': 'Тема',
        'controls.parallax': 'Параллакс',
        'controls.lang': 'Язык',
        'footer.rights': 'Все права защищены',
        'footer.github': 'GitHub',
        'footer.resume': 'Резюме на hh.ru',
        'footer.telegram': 'Telegram',
        'footer.email': 'Email',
    },
    en: {
        'nav.home': 'Home',
        'nav.auth': 'Sign in',
        'nav.dashboard': 'Dashboard',
        'nav.menu': 'Menu',
        'controls.theme': 'Theme',
        'controls.parallax': 'Parallax',
        'controls.lang': 'Language',
        'footer.rights': 'All rights reserved',
        'footer.github': 'GitHub',
        'footer.resume': 'Resume on hh.ru',
        'footer.telegram': 'Telegram',
        'footer.email': 'Email',
    },
};

const lang = ref<Lang>('ru');

export function useI18n() {
    const t = (key: string): string => messages[lang.value][key] ?? key;

    const setLang = (value: Lang) => {
        lang.value = value;
        localStorage.setItem(KEY, value);
        document.documentElement.lang = value;
    };

    const toggleLang = () => setLang(lang.value === 'ru' ? 'en' : 'ru');

    onMounted(() => {
        const saved = localStorage.getItem(KEY) as Lang | null;
        if (saved === 'ru' || saved === 'en') {
            lang.value = saved;
        } else {
            lang.value = navigator.language.startsWith('ru') ? 'ru' : 'en';
        }
        document.documentElement.lang = lang.value;
    });

    return { lang, t, setLang, toggleLang };
}