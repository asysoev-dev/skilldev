<template>
    <button
        :type="type"
        :class="buttonClasses"
        :disabled="disabled || loading"
        :aria-busy="loading"
        :aria-disabled="disabled || loading"
        @click="handleClick"
    >
        <span v-if="loading" class="button__spinner">
            <svg class="button__spinner-icon" viewBox="0 0 50 50">
                <circle
                    class="button__spinner-path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke-width="4"
                />
            </svg>
        </span>

        <span v-if="iconLeft && !loading" class="button__icon button__icon--left">
            <component :is="iconLeft" />
        </span>

        <span v-if="!loading" class="button__text">
            <slot>{{ label }}</slot>
        </span>

        <span v-if="iconRight && !loading" class="button__icon button__icon--right">
            <component :is="iconRight" />
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'text'
    | 'primary-action'
    | 'danger-action'
    | 'outline-primary-action'
    | 'outline-danger-action';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: ButtonType;
    label?: string;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    fullWidthMobile?: boolean;
    iconLeft?: Component;
    iconRight?: Component;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    label: '',
    loading: false,
    disabled: false,
    fullWidth: false,
    fullWidthMobile: false,
});

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

const buttonClasses = computed(() => {
    const classes: string[] = ['button', `button--${props.variant}`, `button--${props.size}`];

    if (props.fullWidth) classes.push('button--full-width');
    if (props.fullWidthMobile) classes.push('button--full-width-mobile');
    if (props.loading) classes.push('button--loading');
    if (props.disabled) classes.push('button--disabled');
    if (props.class) classes.push(props.class);

    return classes.join(' ');
});

const handleClick = (event: MouseEvent) => {
    if (props.disabled || props.loading) return;
    emit('click', event);
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.button {
    @include button-base;
    @include focus-ring;

    position: relative;
    padding: 12px 24px;
    min-height: 44px;
    border-radius: var(--radius-md);
    font-size: var(--font-body);
    font-weight: 500;
    border: 1px solid transparent;
    transition: all var(--transition-base);
    gap: var(--gap-sm);

    &:hover:not(:disabled):not(.button--loading) {
        transform: translateY(-2px);
    }

    &:active:not(:disabled):not(.button--loading) {
        transform: translateY(0);
    }

    &:disabled,
    &.button--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    &.button--loading {
        cursor: wait;
        opacity: 0.8;
    }
}

// ИКОНКИ
.button__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    pointer-events: none;

    :deep(svg) {
        width: 100%;
        height: 100%;
    }
}

// СПИННЕР
.button__spinner {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 20px;
    height: 20px;
}

.button__spinner-icon {
    width: 100%;
    height: 100%;
    animation: spin 1s linear infinite;
}

.button__spinner-path {
    stroke: currentColor;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}

// ВАРИАНТЫ

// PRIMARY (заливка)
.button--primary {
    background: var(--btn-bg);
    color: var(--btn-text);
    border-color: var(--btn-bg);

    &:hover:not(:disabled) {
        box-shadow: 0 0 25px rgba(0, 212, 255, 0.2);
    }
}

// SECONDARY
.button--secondary {
    background: var(--neon-blue);
    color: #08080c;
    border-color: var(--neon-blue);

    &:hover:not(:disabled) {
        box-shadow: 0 0 25px rgba(0, 212, 255, 0.3);
    }
}

// OUTLINE (стеклянная)
.button--outline {
    background: transparent;
    color: var(--text-main);
    border: 1px solid var(--border-color);

    &:hover:not(:disabled) {
        background: var(--glass-bg);
        border-color: var(--neon-blue);
        color: var(--neon-blue);
    }
}

// GHOST
.button--ghost {
    background: transparent;
    color: var(--text-main);
    border-color: transparent;

    &:hover:not(:disabled) {
        background: var(--glass-bg);
    }
}

// TEXT
.button--text {
    background: transparent;
    color: var(--text-main);
    padding: 8px 4px;
    min-height: 32px;
    border-radius: 0;
    border-bottom: 1px solid transparent;

    &:hover:not(:disabled) {
        color: var(--neon-blue);
        border-bottom-color: var(--neon-blue);
        transform: none;
    }
}

// PRIMARY-ACTION (синий неон с прозрачностью)
.button--primary-action {
    background: rgba(0, 212, 255, 0.6);
    color: #08080c;
    backdrop-filter: blur(4px);

    &:hover:not(:disabled) {
        box-shadow: 0 0 25px rgba(0, 212, 255, 0.25);
    }
}

// DANGER-ACTION (розовый неон с прозрачностью)
.button--danger-action {
    background: rgba(255, 45, 149, 0.6);
    color: #08080c;
    backdrop-filter: blur(4px);

    &:hover:not(:disabled) {
        box-shadow: 0 0 25px rgba(255, 45, 149, 0.25);
    }
}

// OUTLINE PRIMARY-ACTION
.button--outline-primary-action {
    background: transparent;
    color: var(--neon-blue);
    border: 1px solid rgba(0, 212, 255, 0.4);

    &:hover:not(:disabled) {
        background: rgba(0, 212, 255, 0.1);
        box-shadow: 0 0 15px rgba(0, 212, 255, 0.1);
    }
}

// OUTLINE DANGER-ACTION
.button--outline-danger-action {
    background: transparent;
    color: var(--neon-pink);
    border: 1px solid rgba(255, 45, 149, 0.4);

    &:hover:not(:disabled) {
        background: rgba(255, 45, 149, 0.1);
        box-shadow: 0 0 15px rgba(255, 45, 149, 0.1);
    }
}

// РАЗМЕРЫ

.button--xs {
    padding: 6px 12px;
    min-height: 32px;
    font-size: var(--font-small);
    border-radius: var(--radius-sm);
}

.button--sm {
    padding: 8px 16px;
    min-height: 36px;
    font-size: var(--font-small);
}

.button--md {
    padding: 12px 24px;
    min-height: 44px;
    font-size: var(--font-body);
}

.button--lg {
    padding: 14px 32px;
    min-height: 52px;
    font-size: 18px;
}

.button--xl {
    padding: 18px 40px;
    min-height: 60px;
    font-size: 20px;
}

// FULL-WIDTH

.button--full-width {
    width: 100%;
}

// На мобилке — 100%, на планшете — auto
.button--full-width-mobile {
    width: 100%;

    @include respond(tablet) {
        width: auto;
    }
}

// АДАПТИВ

@include respond-down(tablet) {
    .button--lg,
    .button--xl {
        padding: 12px 24px;
        min-height: 44px;
        font-size: var(--font-body);
    }
}
</style>
