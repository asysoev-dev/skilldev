<template>
    <div class="app-layout">
        <ParallaxLayer />

        <div class="app-layout__controls">
            <ThemeSwitcher />
            <ParallaxToggle />
        </div>

        <Header />

        <main class="app-layout__main">
            <div class="container">
                <RouterView />
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ParallaxLayer } from '@widgets/parallax-layer';
import { Header } from '@widgets/header';
import { Footer } from '@widgets/footer';
import { ThemeSwitcher } from '@features/theme-switcher';
import { ParallaxToggle } from '@features/parallax-toggle';
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.app-layout {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-layout__controls {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: $z-controls;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;

    @include respond-down(tablet) {
        display: none;
    }
}

.app-layout__main {
    position: relative;
    z-index: $z-content;
    flex: 1;
    padding: var(--section-spacing) 0;
}
</style>