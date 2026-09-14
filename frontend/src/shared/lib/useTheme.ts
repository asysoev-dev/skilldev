import { ref, computed, watch, onMounted } from 'vue';

type ThemeMode = 'light' | 'dark' | 'auto';
type Resolved = 'light' | 'dark';

const KEY = '   ';

const mode = ref<ThemeMode>('auto');
const systemDark = ref(false);
const ready = ref(false);

export function useTheme() {
    const resolved = computed<Resolved>(() =>
        mode.value === 'auto' ? (systemDark.value ? 'dark' : 'light') : mode.value
    );

    const isDark = computed(() => resolved.value === 'dark');

    const apply = (theme: Resolved) =>
        document.body.classList.toggle('dark-theme', theme === 'dark');

    const setTheme = (value: ThemeMode) => {
        mode.value = value;
        localStorage.setItem(KEY, value);
    };

    const toggleTheme = () => setTheme(isDark.value ? 'light' : 'dark');

    onMounted(() => {
        const saved = localStorage.getItem(KEY) as ThemeMode | null;
        if (saved) mode.value = saved;

        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        systemDark.value = mql.matches;
        mql.addEventListener('change', (e) => (systemDark.value = e.matches));

        ready.value = true;
    });

    watch([resolved, ready], ([theme, r]) => r && apply(theme), { immediate: true });

    return { mode, resolved, isDark, setTheme, toggleTheme };
}