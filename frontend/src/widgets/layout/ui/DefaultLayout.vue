<template>
    <div class="app-layout">
        <ParallaxLayer />

        <div class="app-layout__controls">
            <ThemeSwitcher />
            <ParallaxToggle />
        </div>

        <header class="app-layout__header">
            <div class="container app-layout__header-inner">
                <RouterLink to="/" class="app-layout__logo">
                    <span class="app-layout__logo-text">myskill</span>DEV<span class="app-layout__logo-dot">.</span>
                </RouterLink>
                <nav class="app-layout__nav">
                    <RouterLink to="/" class="app-layout__nav-link">Главная</RouterLink>
                    <RouterLink to="/auth" class="app-layout__nav-link">Вход</RouterLink>
                    <RouterLink to="/dashboard" class="app-layout__nav-link">Dashboard</RouterLink>
                </nav>
            </div>
        </header>

        <main class="app-layout__main">
            <div class="container">
                <RouterView />
            </div>
        </main>

        <footer class="app-layout__footer">
            <div class="container">
                <p class="app-layout__footer-text">Алексей Сысоев · 2025 · ✦</p>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ParallaxLayer } from '@widgets/parallax-layer';
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
        top: 16px;
        right: 16px;
        gap: 8px;
    }
}

.app-layout__header {
    position: relative;
    z-index: $z-content;
    padding: 24px 0;

    @include respond-down(tablet) {
        padding: 16px 0;
    }
}

.app-layout__header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-md);
}

.app-layout__logo {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;
    color: var(--text-main);
    text-decoration: none;
    white-space: nowrap;
}

.app-layout__logo-text {
    font-size: var(--font-small);
    padding-right: 2px;
    color: var(--text-secondary);
}

.app-layout__logo-dot {
    color: var(--neon-blue);
}

.app-layout__nav {
    display: flex;
    gap: var(--gap-lg);

    @include respond-down(tablet) {
        display: none;
    }
}

.app-layout__nav-link {
    font-size: var(--font-small);
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--transition-base);
    position: relative;

    &:hover {
        color: var(--text-main);
    }

    &.router-link-active {
        color: var(--neon-blue);

        &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            right: 0;
            height: 1px;
            background: var(--neon-blue);
            box-shadow: 0 0 8px var(--neon-blue);
        }
    }
}

.app-layout__main {
    position: relative;
    z-index: $z-content;
    flex: 1;
    padding: var(--section-spacing) 0;
}

.app-layout__footer {
    position: relative;
    z-index: $z-content;
    padding: 32px 0 24px;
    border-top: 1px solid var(--footer-border);
}

.app-layout__footer-text {
    text-align: center;
    font-size: var(--font-small);
    color: var(--text-secondary);
    margin: 0;
}
</style>