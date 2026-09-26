<template>
    <Teleport v-if="visible" to="body">
        <Transition name="banner">
            <div v-if="visible" class="tour-banner">
                <div class="tour-banner__content">
                    <strong class="tour-banner__title">Хочешь быстрый тур?</strong>
                    <span class="tour-banner__text"> Покажу за несколько шагов, что здесь есть. </span>
                </div>

                <div class="tour-banner__actions">
                    <Button variant="text" size="sm" @click="dismiss"> Пропустить </Button>
                    <Button variant="primary" size="sm" @click="startTour"> Начать </Button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@shared/ui';
import { useTour } from '@shared/lib/useTour';
import { tourSteps } from '@shared/lib/tourSteps';
import { useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const { start, shouldShowBanner } = useTour();

const visible = ref(false);

onMounted(() => {
    if (route.path !== '/') return;
    visible.value = shouldShowBanner();
});

const startTour = () => {
    visible.value = false;
    start(tourSteps, router);
};

const dismiss = () => {
    visible.value = false;
    localStorage.setItem('portfolioTourShown', 'true');
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.tour-banner {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: $z-toast;
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    padding: var(--gap-md);
    border-radius: var(--radius-lg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    max-width: calc(100vw - 32px);

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

    @include respond-down(tablet) {
        flex-direction: column;
        align-items: stretch;
        bottom: 16px;
    }
}

.tour-banner__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.tour-banner__title {
    font-size: var(--font-small);
    font-weight: 600;
    color: var(--text-main);
}

.tour-banner__text {
    font-size: var(--font-small);
    color: var(--text-secondary);
}

.tour-banner__actions {
    display: flex;
    gap: var(--gap-sm);
    flex-shrink: 0;

    @include respond-down(tablet) {
        justify-content: flex-end;
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
    transform: translate(-50%, 20px);
}
</style>
