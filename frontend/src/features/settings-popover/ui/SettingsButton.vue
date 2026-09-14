<template>
    <button
        type="button"
        class="settings-button"
        :class="{ 'settings-button--active': open }"
        :aria-label="open ? 'Закрыть настройки' : 'Открыть настройки'"
        :aria-expanded="open"
        @click="emit('click')"
    >
        <Cog6ToothIcon class="settings-button__icon" />
    </button>
</template>

<script setup lang="ts">
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

interface Props {
    open?: boolean;
}

withDefaults(defineProps<Props>(), { open: false });

const emit = defineEmits<{ (e: 'click'): void }>();
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.settings-button {
    @include flex(row, center, center);
    @include focus-ring;
    @include touch-target;

    padding: 8px;
    border-radius: var(--radius-full);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: var(--glass-border);
    color: var(--text-main);
    cursor: pointer;
    transition: all var(--transition-base);

    &:hover {
        background: var(--glass-hover);
    }
}

.settings-button--active {
    border-color: var(--neon-blue);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);

    .settings-button__icon {
        color: var(--neon-blue);
    }
}

.settings-button__icon {
    width: 20px;
    height: 20px;
    transition: transform var(--transition-base), color var(--transition-base);
}

.settings-button--active .settings-button__icon {
    transform: rotate(60deg);
}
</style>