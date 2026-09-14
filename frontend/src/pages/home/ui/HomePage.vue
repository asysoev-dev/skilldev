<template>
    <div class="home-page">
        <Hero />

        <section class="home-page__placeholder">
            <p>Пока тут пусто.</p>
        </section>
    </div>
</template>

<script setup lang="ts">
import { Hero } from '@widgets/hero';
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.home-page {
    display: flex;
    flex-direction: column;
    gap: var(--section-spacing);
}

.home-page__placeholder {
    @include glass;
    padding: var(--card-padding);
    border-radius: var(--radius-lg);
    text-align: center;
    color: var(--text-secondary);
}
</style>
