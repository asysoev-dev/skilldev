<template>
    <Teleport v-if="visible" to="body">
        <Transition name="banner">
            <div class="mobile-notice">
                <div class="mobile-notice__content">
                    <strong class="mobile-notice__title">Вы находитесь в мобильной версии</strong>
                    <span class="mobile-notice__text">
                        Чтобы использовать весь функционал, рекомендую перейти в десктопную версию.
                    </span>
                </div>

                <button
                    type="button"
                    class="mobile-notice__close"
                    aria-label="Закрыть"
                    @click="dismiss"
                >
                    ✕
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMediaQuery } from '@shared/lib/useMediaQuery';

const KEY = 'portfolioMobileNoticeShown';

const isMobile = useMediaQuery('(max-width: 767px)');
const visible = ref(false);

onMounted(() => {
    visible.value = isMobile.value && localStorage.getItem(KEY) !== 'true';
});

const dismiss = () => {
    visible.value = false;
    localStorage.setItem(KEY, 'true');
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.mobile-notice {
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    z-index: $z-toast;
    display: flex;
    align-items: flex-start;
    gap: var(--gap-md);
    padding: var(--gap-md);
    border-radius: var(--radius-lg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);

    body:not(.dark-theme) & {
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    body.dark-theme & {
        background: rgba(30, 30, 40, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.05);
    }
}

.mobile-notice__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
}

.mobile-notice__title {
    font-size: var(--font-small);
    font-weight: 600;
    color: var(--text-main);
}

.mobile-notice__text {
    font-size: var(--font-small);
    color: var(--text-secondary);
    line-height: 1.4;
}

.mobile-notice__close {
    @include focus-ring;
    @include touch-target;

    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 16px;
    cursor: pointer;
    border-radius: var(--radius-md);
    flex-shrink: 0;

    &:hover {
        color: var(--text-main);
    }
}

.banner-enter-active,
.banner-leave-active {
    transition:
        opacity var(--transition-base),
        transform var(--transition-base);
}

.banner-enter-from,
.banner-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
