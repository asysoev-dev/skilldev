<template>
    <header class="header">
        <div class="container header__inner">
            <RouterLink to="/" class="header__logo">
                <span class="header__logo-text">myskill</span>DEV<span class="header__logo-dot"
                    >.</span
                >
            </RouterLink>

            <div class="header__right">
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

                <div ref="settingsRef" class="header__settings">
                    <SettingsButton :open="settingsOpen" @click="toggleSettings" />
                    <SettingsPopover :open="settingsOpen" />
                </div>
            </div>

            <BurgerButton
                class="header__burger"
                :open="drawerOpen"
                @click="drawerOpen = !drawerOpen"
            />
        </div>

        <MobileDrawer v-model:open="drawerOpen" />
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { BurgerButton } from '@features/burger-button';
import { SettingsButton, SettingsPopover } from '@features/settings-popover';
import { MobileDrawer } from '@widgets/mobile-drawer';
import { useI18n } from '@shared/lib/useI18n';

const { t } = useI18n();
const drawerOpen = ref(false);
const settingsOpen = ref(false);
const settingsRef = ref<HTMLElement | null>(null);

const links = [
    { to: '/', label: 'nav.home' },
    { to: '/auth', label: 'nav.auth' },
    { to: '/dashboard', label: 'nav.dashboard' },
];

const toggleSettings = () => {
    settingsOpen.value = !settingsOpen.value;
};

const onClickOutside = (e: MouseEvent) => {
    if (!settingsOpen.value) return;
    if (settingsRef.value && !settingsRef.value.contains(e.target as Node)) {
        settingsOpen.value = false;
    }
};

const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') settingsOpen.value = false;
};

onMounted(() => {
    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onEsc);
});

onUnmounted(() => {
    document.removeEventListener('click', onClickOutside);
    document.removeEventListener('keydown', onEsc);
});
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
    font-size: var(--font-body);
    padding-right: 2px;
    color: var(--neon-blue);
}

.header__logo-dot {
    color: var(--neon-blue);
}

.header__right {
    display: flex;
    align-items: center;
    gap: var(--gap-xl);
    margin-left: auto;
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

    &.router-link-exact-active {
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

.header__settings {
    position: relative;

    @include respond-down(tablet) {
        display: none;
    }
}

.header__burger.burger {
    display: none;

    @include respond-down(tablet) {
        display: flex;
    }
}
</style>
