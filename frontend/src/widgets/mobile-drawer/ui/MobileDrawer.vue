<template>
    <Teleport v-if="open" to="body">
        <Transition name="drawer">
            <div v-if="open" class="drawer" role="dialog" aria-modal="true" @click.self="close">
                <aside class="drawer__panel">
                    <header class="drawer__header">
                        <RouterLink to="/" class="drawer__logo" @click="close">
                            <span class="drawer__logo-text">myskill</span>DEV<span
                                class="drawer__logo-dot"
                                >.</span
                            >
                        </RouterLink>
                        <BurgerButton :open="true" @click="close" />
                    </header>

                    <nav class="drawer__nav">
                        <RouterLink
                            v-for="link in links"
                            :key="link.to"
                            :to="link.to"
                            class="drawer__nav-link"
                            @click="close"
                        >
                            {{ t(link.label) }}
                        </RouterLink>
                    </nav>

                    <div class="drawer__controls">
                        <div class="drawer__control">
                            <span class="drawer__control-label">{{ t('controls.theme') }}</span>
                            <Switch :model-value="isDark" @update:model-value="toggleTheme" />
                        </div>

                        <div class="drawer__control">
                            <span class="drawer__control-label">{{ t('controls.lang') }}</span>
                            <LangSwitcher />
                        </div>
                    </div>
                </aside>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { BurgerButton } from '@features/burger-button';
import { LangSwitcher } from '@features/lang-switcher';
import { useTheme } from '@shared/lib/useTheme';
import { useI18n } from '@shared/lib/useI18n';
import Switch from '@shared/ui/Switch/Switch.vue';

interface Props {
    open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>();

const { t } = useI18n();
const { isDark, toggleTheme } = useTheme();

const links = [
    { to: '/', label: 'nav.home' },
    { to: '/auth', label: 'nav.auth' },
    { to: '/dashboard', label: 'nav.dashboard' },
];

const close = () => emit('update:open', false);

watch(
    () => props.open,
    (open) => {
        document.body.classList.toggle('scroll-lock', open);
    }
);

onUnmounted(() => {
    document.body.classList.remove('scroll-lock');
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.drawer {
    position: fixed;
    inset: 0;
    z-index: $z-modal;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

.drawer__panel {
    @include flex(column);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(320px, 85vw);
    padding: 20px;
    gap: var(--gap-lg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-right: var(--glass-border);
    overflow-y: auto;

    body:not(.dark-theme) & {
        background: rgba(255, 255, 255, 0.92);
    }

    body.dark-theme & {
        background: rgba(8, 8, 12, 0.85);
    }
}

.drawer__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.drawer__logo {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;
    color: var(--text-main);
    text-decoration: none;
}

.drawer__logo-text {
    font-size: var(--font-body);
    padding-right: 2px;
    color: var(--neon-blue);
}

.drawer__logo-dot {
    color: var(--neon-blue);
}

.drawer__nav {
    @include flex(column);
    gap: var(--gap-sm);
}

.drawer__nav-link {
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-size: var(--font-body);
    color: var(--text-secondary);
    text-decoration: none;
    transition:
        background var(--transition-base),
        color var(--transition-base);

    &:hover {
        background: var(--glass-hover);
        color: var(--text-main);
    }

    &.router-link-exact-active {
        color: var(--neon-blue);
        background: rgba(0, 212, 255, 0.08);
    }
}

.drawer__controls {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
    margin-top: auto;
    padding-top: var(--gap-lg);
    border-top: 1px solid var(--footer-border);
}

.drawer__control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-md);
}

.drawer__control-label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-main);
    white-space: nowrap;
}

.drawer-enter-active,
.drawer-leave-active {
    transition: opacity var(--transition-base);
}

.drawer-enter-active .drawer__panel,
.drawer-leave-active .drawer__panel {
    transition: transform var(--transition-base);
}

.drawer-enter-from,
.drawer-leave-to {
    opacity: 0;
}

.drawer-enter-from .drawer__panel,
.drawer-leave-to .drawer__panel {
    transform: translateX(-100%);
}
</style>
