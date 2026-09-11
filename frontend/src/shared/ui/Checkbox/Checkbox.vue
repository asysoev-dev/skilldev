<template>
    <label class="checkbox" :class="{ 'checkbox--disabled': disabled }">
        <input
            type="checkbox"
            :checked="modelValue"
            :disabled="disabled"
            :aria-invalid="!!error"
            class="checkbox__input"
            @change="onChange"
        />
        <span class="checkbox__mark" :class="{ 'checkbox__mark--error': !!error }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </span>
        <span v-if="label || $slots.default" class="checkbox__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup lang="ts">
interface Props {
    modelValue?: boolean;
    label?: string;
    disabled?: boolean;
    error?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    label: '',
    disabled: false,
    error: '',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'change', value: boolean): void;
}>();

const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
    emit('change', target.checked);
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-md);
    cursor: pointer;
    user-select: none;
    min-height: 44px;
    padding: 4px 0;
}

.checkbox--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.checkbox__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.checkbox__mark {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-base);
    position: relative;

    svg {
        width: 14px;
        height: 14px;
        color: #ffffff;
        opacity: 0;
        transform: scale(0.5);
        transition: all var(--transition-base);
    }

    body:not(.dark-theme) & {
        background: #ffffff;
        border: 1px solid var(--border-color);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    }

    body.dark-theme & {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: 2px solid var(--glass-border);
    }
}

.checkbox:hover:not(.checkbox--disabled) .checkbox__mark {
    border-color: var(--neon-blue);
}

.checkbox__mark--error {
    border-color: var(--neon-red) !important;
}

.checkbox__input:checked + .checkbox__mark {
    background: rgba(0, 212, 255, 0.6);
    border-color: var(--neon-blue);
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);

    svg {
        opacity: 1;
        transform: scale(1);
    }
}

.checkbox__input:focus-visible + .checkbox__mark {
    outline: 2px solid var(--neon-blue);
    outline-offset: 2px;
}

.checkbox__label {
    font-size: var(--font-body);
    color: var(--text-main);
    transition: color var(--transition-theme);
}
</style>
