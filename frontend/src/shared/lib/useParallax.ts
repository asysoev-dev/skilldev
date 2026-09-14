import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMediaQuery } from './useMediaQuery';

const KEY = 'portfolioParallax';

const enabled = ref(false);
const x = ref(0);
const y = ref(0);
const ready = ref(false);

let raf = 0;
let targetX = 0;
let targetY = 0;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function useParallax() {
    const finePointer = useMediaQuery('(pointer: fine)');
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const isMobile = useMediaQuery('(max-width: 767px)');

    const canRun = computed(() => finePointer.value && !reducedMotion.value && !isMobile.value);
    const isActive = computed(() => enabled.value && canRun.value);

    const tick = () => {
        x.value = lerp(x.value, targetX, 0.08);
        y.value = lerp(y.value, targetY, 0.08);
        raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
        if (!isActive.value) return;
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const setEnabled = (value: boolean) => {
        enabled.value = value;
        localStorage.setItem(KEY, value ? 'on' : 'off');
    };

    const toggle = () => setEnabled(!enabled.value);

    onMounted(() => {
        if (ready.value) return;
        enabled.value = localStorage.getItem(KEY) === 'on';
        raf = requestAnimationFrame(tick);
        window.addEventListener('mousemove', onMove, { passive: true });
        ready.value = true;
    });

    onUnmounted(() => {
        window.removeEventListener('mousemove', onMove);
        cancelAnimationFrame(raf);
    });

    return { enabled, isActive, canRun, x, y, setEnabled, toggle };
}
