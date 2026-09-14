<template>
    <Transition name="popover">
        <div v-if="open" class="settings-popover" role="dialog" aria-label="Настройки">
            <div class="settings-popover__arrow" />

            <div class="settings-popover__item">
                <span class="settings-popover__label">{{ t('controls.theme') }}</span>
                <Switch :model-value="isDark" @update:model-value="toggleTheme" />
            </div>

            <div v-if="canRun" class="settings-popover__item">
                <span class="settings-popover__label">{{ t('controls.parallax') }}</span>
                <Switch :model-value="enabled" @update:model-value="toggle" />
            </div>

            <div class="settings-popover__item">
                <span class="settings-popover__label">{{ t('controls.lang') }}</span>
                <LangSwitcher />
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useTheme } from '@shared/lib/useTheme';
import { useParallax } from '@shared/lib/useParallax';
import { useI18n } from '@shared/lib/useI18n';
import { LangSwitcher } from '@features/lang-switcher';
import Switch from '@shared/ui/Switch/Switch.vue';

interface Props {
    open: boolean;
}

defineProps<Props>();

const { isDark, toggleTheme } = useTheme();
const { enabled, canRun, toggle } = useParallax();
const { t } = useI18n();
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.settings-popover {
    @include glass;

    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    z-index: $z-dropdown;
    min-width: 240px;
    padding: 8px;
    border-radius: var(--radius-lg);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.settings-popover__arrow {
    position: absolute;
    top: -6px;
    right: 16px;
    width: 12px;
    height: 12px;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border-top: var(--glass-border);
    border-left: var(--glass-border);
    transform: rotate(45deg);
}

.settings-popover__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-md);
    padding: 8px 12px;
    border-radius: var(--radius-md);
    transition: background var(--transition-base);

    &:hover {
        background: var(--glass-hover);
    }
}

.settings-popover__label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-main);
    white-space: nowrap;
}

.popover-enter-active,
.popover-leave-active {
    transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.popover-enter-from,
.popover-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>