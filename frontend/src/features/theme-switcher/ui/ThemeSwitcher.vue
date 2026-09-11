<template>
    <div class="theme-switcher">
        <span class="theme-switcher__label">Тема</span>
        <Switch :model-value="isDark" @update:model-value="toggleTheme" />
    </div>
</template>

<script setup lang="ts">
import { useTheme } from '@shared/lib/useTheme';
import Switch from '@shared/ui/Switch/Switch.vue';

const { isDark, toggleTheme } = useTheme();
</script>

<style lang="scss" scoped>
.theme-switcher {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-md);
    padding: 8px 12px;
    border-radius: var(--radius-full);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: var(--glass-border);
    cursor: pointer;
    user-select: none;
}

.theme-switcher__label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
}
</style>