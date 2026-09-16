import { ref, computed, nextTick } from 'vue';
import { useMediaQuery } from './useMediaQuery';

export interface TourStep {
    id: string;
    target: string;
    fallbackTarget?: string; // покажет на него, если не найдет target
    title: string;
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    before?: () => void | Promise<void>;
    after?: () => void | Promise<void>;
    waitFor?: number;
    scrollOffset?: number;
    optional?: boolean;
    offsetY?: number;
    offsetX?: number;
}

const KEY = 'portfolioTourShown';

const steps = ref<TourStep[]>([]);
const currentIndex = ref(0);
const active = ref(false);

export function useTour() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const canRun = computed(() => isDesktop.value);

    const currentStep = computed(() => steps.value[currentIndex.value] ?? null);
    const isFirst = computed(() => currentIndex.value === 0);
    const isLast = computed(() => currentIndex.value === steps.value.length - 1);
    const total = computed(() => steps.value.length);

    const waitForElement = (selector: string, timeout = 1000): Promise<Element | null> =>
        new Promise((resolve) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const start = Date.now();
            const timer = setInterval(() => {
                const found = document.querySelector(selector);
                if (found || Date.now() - start > timeout) {
                    clearInterval(timer);
                    resolve(found);
                }
            }, 50);
        });

    const scrollToTarget = async (selector: string, offset = 0) => {
        const el = document.querySelector(selector);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const inViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (inViewport) return;

        const targetY =
            window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2 + offset;

        window.scrollTo({ top: targetY, behavior: 'smooth' });
        await new Promise((r) => setTimeout(r, 500));
    };

    const runStep = async (step: TourStep | null) => {
        if (!step) return;
        if (step.before) await step.before();
        await nextTick();
        if (step.waitFor) {
            const found = await waitForElement(step.target, step.waitFor);
            if (!found && !step.optional) {
                console.warn(`[Tour] target not found: ${step.target}`);
            }
        }
        await scrollToTarget(step.target, step.scrollOffset ?? 0);
    };

    const runAfter = async (step: TourStep | null) => {
        if (step?.after) await step.after();
    };

    const start = async (tourSteps: TourStep[]) => {
        if (!canRun.value) return;
        steps.value = tourSteps;
        currentIndex.value = 0;
        active.value = true;
        await runStep(currentStep.value);
    };

    const next = async () => {
        if (isLast.value) {
            await finish();
            return;
        }
        await runAfter(currentStep.value);
        currentIndex.value++;
        await runStep(currentStep.value);
    };

    const prev = async () => {
        if (currentIndex.value === 0) return;
        await runAfter(currentStep.value);
        currentIndex.value--;
        await runStep(currentStep.value);
    };

    const skip = () => finish();

    const finish = async () => {
        await runAfter(currentStep.value);
        active.value = false;
        currentIndex.value = 0;
        localStorage.setItem(KEY, 'true');
    };

    const shouldShowBanner = () =>
        canRun.value && localStorage.getItem(KEY) !== 'true';

    const restart = async (tourSteps: TourStep[]) => {
        localStorage.removeItem(KEY);
        await start(tourSteps);
    };

    return {
        active,
        currentStep,
        currentIndex,
        isFirst,
        isLast,
        total,
        canRun,
        start,
        next,
        prev,
        skip,
        finish,
        restart,
        shouldShowBanner,
    };
}