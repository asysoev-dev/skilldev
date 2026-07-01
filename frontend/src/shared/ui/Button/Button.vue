<template>
    <button
        :type="type"
        :class="buttonClasses"
        :disabled="disabled || loading"
        :aria-busy="loading"
        :aria-disabled="disabled || loading"
        @click.prevent="handleClick"
    >
        <span v-if="loading" class="button-spinner">
            <svg class="spinner-icon" viewBox="0 0 50 50">
                <circle class="spinner-path" cx="25" cy="25" r="20" fill="none" stroke-width="4" />
            </svg>
        </span>

        <span v-if="iconLeft && !loading" class="button-icon-left">
            <component :is="iconLeft" class="button-icon" />
        </span>

        <span v-if="!loading" class="button-text">
            <slot>{{ label }}</slot>
        </span>

        <span v-if="iconRight && !loading" class="button-icon-right">
            <component :is="iconRight" class="button-icon" />
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'outline'
    | 'ghost';
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
});

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

const buttonClasses = computed(() => {
    const classes: string[] = ['button', `button--${props.variant}`, `button--${props.size}`];

    if (props.fullWidth) {
        classes.push('button--full-width');
    }

    if (props.loading) {
        classes.push('button--loading');
    }

    if (props.disabled) {
        classes.push('button--disabled');
    }

    if (props.class) {
        classes.push(props.class);
    }

    return classes.join(' ');
});

const handleClick = (event: MouseEvent) => {
    if (props.disabled || props.loading) {
        return;
    }
    emit('click', event);
};
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.button {
    @include button-base;
    position: relative;
    padding: $spacing-sm $spacing-lg;
    border-radius: $radius-md;
    background-color: $primary;
    color: $white;
    border: 2px solid transparent;
    font-weight: $font-weight-medium;
    text-decoration: none;
    transition: all $transition-base;
    min-height: 40px;
    min-width: 40px;
    gap: $spacing-sm;

    &:focus-visible {
        outline: 2px solid $primary;
        outline-offset: 2px;
    }

    &:hover:not(:disabled):not(.button--loading) {
        // transform: translateY(-1px);
        box-shadow: $shadow-md;
    }

    &:active:not(:disabled):not(.button--loading) {
        // transform: translateY(0);
        box-shadow: $shadow-sm;
    }

    &:disabled,
    &.button--disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    &.button--loading {
        cursor: wait;
        opacity: 0.8;
    }

    // Адаптив
    @include respond(mobile) {
        font-size: $font-size-sm;
        padding: $spacing-sm $spacing-md;
        min-height: 36px;
    }
}

.button-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    pointer-events: none;
}

.button-icon-left,
.button-icon-right {
    @include flex(row, center, center);
    flex-shrink: 0;
}

.button-icon-left {
    margin-right: $spacing-xs;
}

.button-icon-right {
    margin-left: $spacing-xs;
}

.button-spinner {
    @include flex(row, center, center);
    margin-right: $spacing-sm;
    flex-shrink: 0;
}

.spinner-icon {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
}

.spinner-path {
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

// Primary
.button--primary {
    background-color: $primary;
    color: $white;

    &:hover:not(:disabled):not(.button--loading) {
        background-color: color.adjust($primary, $lightness: -10%);
    }
}

// Secondary
.button--secondary {
    background-color: $secondary;
    color: $white;

    &:hover:not(:disabled):not(.button--loading) {
        background-color: color.adjust($secondary, $lightness: -10%);
    }
}

// Success
.button--success {
    background-color: $success;
    color: $white;

    &:hover:not(:disabled):not(.button--loading) {
        background-color: color.adjust($success, $lightness: -10%);
    }
}

// Danger
.button--danger {
    background-color: $danger;
    color: $white;

    &:hover:not(:disabled):not(.button--loading) {
        background-color: color.adjust($danger, $lightness: -10%);
    }
}

// Warning
.button--warning {
    background-color: $warning;
    color: $dark;

    &:hover:not(:disabled):not(.button--loading) {
        background-color: color.adjust($warning, $lightness: -10%);
    }
}

// Outline
.button--outline {
    background-color: transparent;
    color: $primary;
    border-color: $primary;

    &:hover:not(:disabled):not(.button--loading) {
        background-color: $primary;
        color: $white;
    }
}

// Ghost
.button--ghost {
    background-color: transparent;
    color: $primary;
    border-color: transparent;

    &:hover:not(:disabled):not(.button--loading) {
        background-color: color.adjust($primary, $alpha: -0.9);
    }
}

// XS
.button--xs {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-sm;
    min-height: 28px;
    border-radius: $radius-sm;

    .button-icon {
        width: 14px;
        height: 14px;
    }
}

// SM
.button--sm {
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-sm;
    min-height: 32px;

    .button-icon {
        width: 16px;
        height: 16px;
    }
}

// MD
.button--md {
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-base;
    min-height: 40px;

    .button-icon {
        width: 20px;
        height: 20px;
    }
}

// LG
.button--lg {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-lg;
    min-height: 48px;

    .button-icon {
        width: 24px;
        height: 24px;
    }

    @include respond(mobile) {
        padding: $spacing-sm $spacing-lg;
        font-size: $font-size-base;
        min-height: 40px;
    }
}

// XL
.button--xl {
    padding: $spacing-lg $spacing-xxl;
    font-size: $font-size-lg;
    min-height: 56px;

    .button-icon {
        width: 28px;
        height: 28px;
    }

    @include respond(mobile) {
        padding: $spacing-md $spacing-lg;
        font-size: $font-size-base;
        min-height: 44px;
    }
}

// на всю ширину
.button--full-width {
    width: 100%;
    display: flex;
}
</style>
