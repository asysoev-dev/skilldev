<template>
    <RouterLink to="/#skills" class="back-to-stands">
        <ArrowLeftIcon class="back-to-stands__icon" />
        <span>Назад</span>
    </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.back-to-stands {
    @include focus-ring;
    @include flex(row, flex-start, center);

    gap: 8px;
    padding: 8px 14px;
    border-radius: var(--radius-md);
    font-size: var(--font-small);
    color: var(--text-secondary);
    text-decoration: none;
    transition: all var(--transition-base);
    align-self: flex-start;

    &:hover {
        color: var(--neon-blue);
        background: var(--glass-hover);
        text-decoration: none;
    }
}

.back-to-stands__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}
</style>