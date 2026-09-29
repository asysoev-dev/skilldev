<template>
    <div class="demo-three">
        <BackToStands />

        <header class="demo-three__header">
            <h1 class="demo-three__title">Three.js</h1>
            <p class="demo-three__subtitle">
                WebGL-сцена на Three.js: планеты-технологии, raycasting, orbit controls.
            </p>
        </header>

        <div class="demo-three__stage">
            <span>WebGL-сцена находится на стадии разработки</span>
            <span>Скоро она здесь появится</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BackToStands } from '@shared/ui';
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.demo-three {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    padding: var(--section-spacing) 0;
}

.demo-three__header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
}

.demo-three__title {
    font-size: var(--font-h1);
    font-weight: 600;
    margin: 0;
}

.demo-three__subtitle {
    font-size: var(--font-body);
    color: var(--text-secondary);
    margin: 0;
}

.demo-three__stage {
    @include glass;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-lg);
    color: var(--text-tertiary);
    font-size: var(--font-small);
}
</style>