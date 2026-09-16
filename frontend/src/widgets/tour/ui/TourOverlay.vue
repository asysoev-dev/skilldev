<template>
    <Teleport v-if="active" to="body">
        <div class="tour">
            <div
                v-if="targetRect"
                class="tour__spotlight"
                :class="{ 'is-scrolling': isScrolling }"
                :style="spotlightStyle"
            />

            <div
                v-if="currentStep"
                class="tour__popover"
                :class="{ 'is-scrolling': isScrolling }"
                :style="popoverStyle"
            >
                <div class="tour__header">
                    <span class="tour__step">{{ currentIndex + 1 }} / {{ total }}</span>
                    <button
                        type="button"
                        class="tour__close"
                        aria-label="Закрыть тур"
                        @click="skip"
                    >
                        ✕
                    </button>
                </div>

                <h3 class="tour__title">{{ currentStep.title }}</h3>
                <p class="tour__text">{{ currentStep.text }}</p>

                <div class="tour__actions">
                    <Button v-if="!isFirst" variant="outline" size="sm" @click="prev">
                        Назад
                    </Button>
                    <Button variant="primary" size="sm" @click="next">
                        {{ isLast ? 'Завершить' : 'Далее' }}
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { Button } from '@shared/ui';
import { useTour } from '@shared/lib/useTour';
import { useSettingsPopover } from '@shared/lib/useSettingsPopover';

const { active, currentStep, currentIndex, isFirst, isLast, total, next, prev, skip } = useTour();
const settings = useSettingsPopover();

const targetRect = ref<DOMRect | null>(null);
const isScrolling = ref(false);

let ticking = false;
let scrollTimeout: number | null = null;

const updateRect = async () => {
    if (!currentStep.value) {
        targetRect.value = null;
        return;
    }
    await nextTick();

    let selector = currentStep.value.target;

    if (currentStep.value.fallbackTarget) {
        const el = document.querySelector(selector);
        const inPopover = el?.closest('.settings-popover');
        const popoverOpen = settings.isOpen;   // ← не DOM, а store

        if (!el || (inPopover && !popoverOpen)) {
            selector = currentStep.value.fallbackTarget;
        }
    }

    const el = document.querySelector(selector);
    targetRect.value = el?.getBoundingClientRect() ?? null;
};

const onScrollOrResize = () => {
    isScrolling.value = true;

    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
        isScrolling.value = false;
    }, 100);

    if (!ticking) {
        requestAnimationFrame(() => {
            updateRect();
            ticking = false;
        });
        ticking = true;
    }
};

watch(
    [active, currentIndex, () => settings.isOpen],
    updateRect
);

onMounted(() => {
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('resize', onScrollOrResize);
    window.removeEventListener('scroll', onScrollOrResize);
    if (scrollTimeout) clearTimeout(scrollTimeout);
});

const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') skip();
};

onMounted(() => document.addEventListener('keydown', onEsc));
onUnmounted(() => document.removeEventListener('keydown', onEsc));

const PADDING = 8;

const spotlightStyle = computed(() => {
    if (!targetRect.value) return {};
    const r = targetRect.value;
    return {
        top: `${r.top - PADDING}px`,
        left: `${r.left - PADDING}px`,
        width: `${r.width + PADDING * 2}px`,
        height: `${r.height + PADDING * 2}px`,
    };
});

const popoverStyle = computed(() => {
    if (!targetRect.value) {
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const rect = targetRect.value;
    const position = currentStep.value?.position ?? 'bottom';
    const offsetY = currentStep.value?.offsetY ?? 0;
    const offsetX = currentStep.value?.offsetX ?? 0;
    const gap = 16;
    const popoverWidth = 320;

    if (position === 'top') {
        return {
            top: `${rect.top - gap + offsetY}px`,
            left: `${rect.left + rect.width / 2 + offsetX}px`,
            transform: 'translate(-50%, -100%)',
        };
    }
    if (position === 'left') {
        return {
            top: `${rect.top + rect.height / 2 + offsetY}px`,
            left: `${rect.left - gap + offsetX}px`,
            transform: 'translate(-100%, -50%)',
        };
    }
    if (position === 'right') {
        return {
            top: `${rect.top + rect.height / 2 + offsetY}px`,
            left: `${rect.right + gap + offsetX}px`,
            transform: 'translate(0, -50%)',
        };
    }
    return {
        top: `${rect.bottom + gap + offsetY}px`,
        left: `${Math.min(rect.left + offsetX, window.innerWidth - popoverWidth - 20)}px`,
    };
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.tour {
    position: fixed;
    inset: 0;
    z-index: $z-tour-overlay;
    pointer-events: none;
}

.tour__spotlight {
    position: fixed;
    border-radius: var(--radius-lg);
    box-shadow:
        0 0 0 2px var(--neon-blue),
        0 0 30px rgba(0, 212, 255, 0.3);
    pointer-events: none;
    transition: all var(--transition-base);
    z-index: 1;
}

.tour__spotlight.is-scrolling {
    transition: none;
}

.tour__popover {
    position: fixed;
    z-index: 2;
    width: 320px;
    max-width: calc(100vw - 32px);
    padding: var(--gap-md);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    pointer-events: auto;
    transition:
        top var(--transition-base),
        left var(--transition-base);

    body:not(.dark-theme) & {
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    body.dark-theme & {
        background: rgba(30, 30, 40, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.05);
    }
}

.tour__popover.is-scrolling {
    transition: none;
}

.tour__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tour__step {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
    font-weight: 600;
    letter-spacing: 0.5px;
}

.tour__close {
    @include focus-ring;
    @include touch-target;

    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 16px;
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: color var(--transition-base);

    &:hover {
        color: var(--text-main);
    }
}

.tour__title {
    font-size: var(--font-h3);
    font-weight: 600;
    margin: 0;
    color: var(--text-main);
}

.tour__text {
    font-size: var(--font-small);
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

.tour__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--gap-sm);
    margin-top: var(--gap-sm);
}
</style>
