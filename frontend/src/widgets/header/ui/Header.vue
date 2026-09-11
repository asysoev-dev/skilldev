<template>
    <header class="header">
        <div class="container header__inner">
            <RouterLink to="/" class="header__logo">
                <span class="header__logo-text">myskill</span>DEV<span class="header__logo-dot"
                    >.</span
                >
            </RouterLink>

            <nav class="header__nav">
                <RouterLink
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    class="header__nav-link"
                >
                    {{ t(link.label) }}
                </RouterLink>
            </nav>

            <div class="header__right">
                <LangSwitcher class="header__lang" />
                <BurgerButton
                    class="header__burger"
                    :open="drawerOpen"
                    @click="drawerOpen = !drawerOpen"
                />
            </div>
        </div>

        <MobileDrawer v-model:open="drawerOpen" />
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { BurgerButton } from '@features/burger-button';
import { LangSwitcher } from '@features/lang-switcher';
import { MobileDrawer } from '@widgets/mobile-drawer';
import { useI18n } from '@shared/lib/useI18n';

const { t } = useI18n();
const drawerOpen = ref(false);

const links = [
    { to: '/', label: 'nav.home' },
    { to: '/auth', label: 'nav.auth' },
    { to: '/dashboard', label: 'nav.dashboard' },
];
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.header {
    position: relative;
    z-index: $z-header;
    padding: 24px 0;

    @include respond-down(tablet) {
        padding: 16px 0;
    }
}

.header__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-md);
}

.header__logo {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;
    color: var(--text-main);
    text-decoration: none;
    white-space: nowrap;
}

.header__logo-text {
    font-size: var(--font-small);
    padding-right: 2px;
    color: var(--text-secondary);
}

.header__logo-dot {
    color: var(--neon-blue);
}

.header__nav {
    display: flex;
    gap: var(--gap-lg);

    @include respond-down(tablet) {
        display: none;
    }
}

.header__nav-link {
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

.header__right {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.header__lang {
    @include respond-down(tablet) {
        display: none;
    }
}

.header__burger {
    display: none;

    @include respond-down(tablet) {
        display: flex;
    }
}
</style>
