import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function useMediaQuery(query: string): Ref<boolean> {
    const matches = ref(false);
    let mql: MediaQueryList | null = null;
    const onChange = (e: MediaQueryListEvent) => (matches.value = e.matches);

    onMounted(() => {
        mql = window.matchMedia(query);
        matches.value = mql.matches;
        mql.addEventListener('change', onChange);
    });

    onUnmounted(() => mql?.removeEventListener('change', onChange));

    return matches;
}