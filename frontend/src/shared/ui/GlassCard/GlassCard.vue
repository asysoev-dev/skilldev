<template>
    <component
        :is="clickable ? 'button' : tag"
        class="glass-card"
        :class="classes"
        :style="style"
        :type="clickable ? 'button' : undefined"
        @click="onClick"
    >
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    tag?: string;
    accent?: string;
    padding?: 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    tag: 'div',
    accent: '',
    padding: 'md',
    hoverable: true,
    clickable: false,
});

const emit = defineEmits<{ (e: 'click', event: Event): void }>();

const classes = computed(() => [
    {
        'glass-card--hoverable': props.hoverable,
        'glass-card--clickable': props.clickable,
    },
    `glass-card--padding-${props.padding}`,
]);

const style = computed(() => (props.accent ? { '--card-accent': props.accent } : {}));

const onClick = (e: Event) => props.clickable && emit('click', e);
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.glass-card {
    @include glass;
    position: relative;
    border-radius: var(--radius-lg);
    transition: all var(--transition-base);
    overflow: hidden;
    cursor: pointer;
}

.glass-card--padding-sm {
    padding: var(--gap-md);
}
.glass-card--padding-md {
    padding: var(--card-padding);
}
.glass-card--padding-lg {
    padding: calc(var(--card-padding) * 1.5);
}

.glass-card--hoverable:hover {
    transform: translateY(-4px);
    background: var(--glass-hover);

    &::before {
        opacity: 1;
    }
}

.glass-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--transition-base);
    background: radial-gradient(
        circle at top left,
        color-mix(in srgb, var(--card-accent, transparent) 12%, transparent),
        transparent 60%
    );
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--card-accent, transparent) 25%, transparent);
}

.glass-card--clickable {
    cursor: pointer;
    @include focus-ring;
}
</style>
