<template>
    <component
        :is="tag"
        class="glass-card"
        :class="cardClasses"
        :style="cardStyle"
        :role="clickable ? 'button' : undefined"
        :tabindex="clickable ? 0 : undefined"
        @click="onClick"
        @keydown.enter="onClick"
        @keydown.space.prevent="onClick"
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

const emit = defineEmits<{
    (e: 'click', event: Event): void;
}>();

const cardClasses = computed(() => ({
    'glass-card--hoverable': props.hoverable,
    'glass-card--clickable': props.clickable,
    [`glass-card--padding-${props.padding}`]: true,
}));

const cardStyle = computed(() => {
    if (!props.accent) return {};
    return { '--card-accent': props.accent };
});

const onClick = (event: Event) => {
    if (props.clickable) {
        emit('click', event);
    }
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.glass-card {
    @include glass;

    position: relative;
    border-radius: var(--radius-lg);
    transition: all var(--transition-base);
    overflow: hidden;
}

// PADDING
.glass-card--padding-sm {
    padding: var(--gap-md);
}

.glass-card--padding-md {
    padding: var(--card-padding);
}

.glass-card--padding-lg {
    padding: calc(var(--card-padding) * 1.5);
}

// HOVER
.glass-card--hoverable {
    &:hover {
        transform: translateY(-4px);
        background: var(--glass-hover);

        // Если задан accent — неоновая подсветка
        // & when (isdefined(--card-accent)) {
        // //     // placeholder для будущих фич
        // }
    }
}

// CLICKABLE
.glass-card--clickable {
    cursor: pointer;

    @include focus-ring;
}
</style>
