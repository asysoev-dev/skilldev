<template>
    <component
        :is="clickable ? 'button' : 'span'"
        class="tag"
        :class="classes"
        :type="clickable ? 'button' : undefined"
        @click="onClick"
    >
        <span v-if="icon" class="tag__icon">
            <component :is="icon" />
        </span>
        <span class="tag__text">
            <slot>{{ label }}</slot>
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

type Variant =
    | 'default'
    | 'primary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'neon-blue'
    | 'neon-pink'
    | 'neon-yellow'
    | 'neon-green'
    | 'neon-purple';

type Size = 'sm' | 'md';

interface Props {
    variant?: Variant;
    size?: Size;
    label?: string;
    icon?: Component;
    clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'md',
    label: '',
    clickable: false,
});

const emit = defineEmits<{ (e: 'click', event: Event): void }>();

const classes = computed(() => [
    `tag--${props.variant}`,
    `tag--${props.size}`,
    { 'tag--clickable': props.clickable },
]);

const onClick = (e: Event) => props.clickable && emit('click', e);
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    font-size: var(--font-small);
    font-weight: 500;
    line-height: 1.4;
    white-space: nowrap;
    border: 1px solid transparent;
    transition: all var(--transition-base);
    background: transparent;
    font-family: inherit;
}

.tag--sm {
    padding: 2px 8px;
    font-size: var(--font-tiny);
}
.tag--md {
    padding: 4px 10px;
    font-size: var(--font-small);
}

.tag__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 14px;
    height: 14px;

    :deep(svg) {
        width: 100%;
        height: 100%;
    }
}

.tag--default {
    background: var(--glass-bg);
    border-color: var(--border-color);
    color: var(--text-secondary);
    backdrop-filter: var(--glass-blur);
}

.tag--primary {
    background: rgba(0, 212, 255, 0.15);
    border-color: rgba(0, 212, 255, 0.4);
    color: var(--neon-blue);
}
.tag--success {
    background: rgba(0, 255, 171, 0.15);
    border-color: rgba(0, 255, 171, 0.4);
    color: var(--neon-green);
}
.tag--danger {
    background: rgba(255, 59, 92, 0.15);
    border-color: rgba(255, 59, 92, 0.4);
    color: var(--neon-red);
}
.tag--warning {
    background: rgba(255, 215, 0, 0.15);
    border-color: rgba(255, 215, 0, 0.4);
    color: var(--neon-yellow);
}

.tag--neon-blue {
    background: rgba(0, 212, 255, 0.1);
    border-color: rgba(0, 212, 255, 0.35);
    color: var(--neon-blue);
}
.tag--neon-pink {
    background: rgba(255, 45, 149, 0.1);
    border-color: rgba(255, 45, 149, 0.35);
    color: var(--neon-pink);
}
.tag--neon-yellow {
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.35);
    color: var(--neon-yellow);
}
.tag--neon-green {
    background: rgba(0, 255, 171, 0.1);
    border-color: rgba(0, 255, 171, 0.35);
    color: var(--neon-green);
}
.tag--neon-purple {
    background: rgba(138, 43, 226, 0.1);
    border-color: rgba(138, 43, 226, 0.35);
    color: var(--neon-purple);
}

.tag--clickable {
    cursor: pointer;
    @include focus-ring;

    &:hover {
        transform: translateY(-1px);
        filter: brightness(1.15);
    }
}
</style>
