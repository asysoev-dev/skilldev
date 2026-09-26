import { ref, computed, nextTick } from 'vue';
import { useMediaQuery } from './useMediaQuery';
import { lockAllExcept, unlockAll } from './tourAllow';
import type { Router } from 'vue-router';
import { watch } from 'vue';

let tourRouter: Router | null = null;

export interface TourStep {
    id: string;
    target?: string; // класс елемента для подсветки
    fallbackTarget?: string; // покажет на него, если не найдет target
    title: string;
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    before?: () => void | Promise<void>;
    beforeNext?: () => void | Promise<void>;
    after?: () => void | Promise<void>;
    waitFor?: number;
    scrollOffset?: number;
    optional?: boolean; // если не находит элемент по классу, то скипает данный шаг
    offsetY?: number;
    offsetX?: number;
    allow?: string[]; // массив классов которые должны быть кликабельны
    noScroll?: boolean;
}

const KEY = 'portfolioTourShown';

const steps = ref<TourStep[]>([]);
const currentIndex = ref(0);
const active = ref(false);
const isTransitioning = ref(false);

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

        if (step.allow?.length) {
            lockAllExcept(step.allow);
        }

        if (step.target && step.waitFor) {
            const found = await waitForElement(step.target, step.waitFor);

            if (!found && step.optional) {
                console.warn(`skip step "${step.id}": target not found`);
                setTimeout(() => {
                    if (currentIndex.value < steps.value.length - 1) {
                        currentIndex.value++;
                        runStep(steps.value[currentIndex.value]);
                    } else {
                        finish();
                    }
                }, 0);
                return;
            }

            if (!found) {
                console.warn(`target not found: ${step.target}`);
            }
        }

        if (step.target && !step.noScroll) {
            await scrollToTarget(step.target, step.scrollOffset ?? 0);
        }
    };

    const runAfter = async (step: TourStep | null) => {
        if (step?.after) await step.after();
    };

    const start = async (tourSteps: TourStep[], router?: Router) => {
        if (!canRun.value) return;
        if (router) tourRouter = router;

        setupRouteWatcher();

        if (router && router.currentRoute.value.path !== '/') {
            await router.push('/');
            await new Promise((r) => setTimeout(r, 500));
        }

        steps.value = tourSteps;
        currentIndex.value = 0;
        active.value = true;
        document.body.classList.add('tour-locked');
        await runStep(currentStep.value);
    };

    const next = async () => {
        if (isTransitioning.value) return;
        isTransitioning.value = true;
        try {
            const step = currentStep.value;

            if (step?.beforeNext) {
                await step.beforeNext();
            }

            if (isLast.value) {
                await finish();
                return;
            }

            await runAfter(step);
            currentIndex.value++;
            await runStep(currentStep.value);
        } finally {
            isTransitioning.value = false;
        }
    };

    const prev = async () => {
        if (isTransitioning.value) return;
        isTransitioning.value = true;
        try {
            if (currentIndex.value === 0) return;
            await runAfter(currentStep.value);
            currentIndex.value--;
            await runStep(currentStep.value);
        } finally {
            isTransitioning.value = false;
        }
    };

    const skip = async () => {
        if (isTransitioning.value) return;
        isTransitioning.value = true;
        try {
            finish();
        } finally {
            isTransitioning.value = false;
        }
    };

    const finish = async () => {
        await runAfter(currentStep.value);
        active.value = false;
        currentIndex.value = 0;
        document.body.classList.remove('tour-locked');
        unlockAll();
        localStorage.setItem(KEY, 'true');
    };

    const shouldShowBanner = () => canRun.value && localStorage.getItem(KEY) !== 'true';

    const restart = async (tourSteps: TourStep[], router?: Router) => {
        localStorage.removeItem(KEY);
        await start(tourSteps, router);
    };

    const setupRouteWatcher = () => {
        const router = getTourRouter();
        if (!router) return;

        watch(
            () => router.currentRoute.value.path,
            async (newPath) => {
                if (!active.value) return;
                if (isTransitioning.value) return;

                const step = currentStep.value;
                if (!step?.target) return;

                //TODO подумать как избавиться от этого setTimeout
                await new Promise((r) => setTimeout(r, 300));

                const el = document.querySelector(step.target);
                if (!el && step.optional) {
                    console.log(`[Tour] route changed, skipping step "${step.id}"`);
                    await next();
                }
            }
        );
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
        getTourRouter,
    };
}

export const getTourRouter = (): Router | null => tourRouter;
