<template>
    <div v-if="canRun" class="parallax-toggle">
        <span class="parallax-toggle__label">Параллакс</span>
        <Switch :model-value="enabled" @update:model-value="toggle" />
    </div>
</template>

<script setup lang="ts">
import { useParallax } from '@shared/lib/useParallax';
import Switch from '@shared/ui/Switch/Switch.vue';

const { enabled, canRun, toggle } = useParallax();
</script>

<style lang="scss" scoped>
.parallax-toggle {
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

.parallax-toggle__label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
}
</style>