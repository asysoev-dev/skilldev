<template>
    <label class="radio" :class="{ 'radio--disabled': disabled }">
        <input
            type="radio"
            :name="name"
            :value="value"
            :checked="modelValue === value"
            :disabled="disabled"
            :aria-invalid="!!error"
            class="radio__input"
            @change="onChange"
        />
        <span class="radio__mark" :class="{ 'radio__mark--error': !!error }">
            <span class="radio__dot" />
        </span>
        <span v-if="label || $slots.default" class="radio__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup lang="ts">
interface Props {
    modelValue?: string | number | boolean;
    value: string | number | boolean;
    name?: string;
    label?: string;
    disabled?: boolean;
    error?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    name: 'radio',
    label: '',
    disabled: false,
    error: '',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | boolean): void;
    (e: 'change', value: string | number | boolean): void;
}>();

const onChange = () => {
    emit('update:modelValue', props.value);
    emit('change', props.value);
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.radio {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-md);
    cursor: pointer;
    user-select: none;
    min-height: 44px;
    padding: 4px 0;
}

.radio--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.radio__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.radio__mark {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    transition: all var(--transition-base);
    position: relative;

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

.radio__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--transition-base);
}

.radio:hover:not(.radio--disabled) .radio__mark {
    border-color: var(--neon-blue);
}

.radio__mark--error {
    border-color: var(--neon-red) !important;
}

.radio__input:checked + .radio__mark {
    border-color: var(--neon-blue);
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);

    .radio__dot {
        opacity: 1;
        transform: scale(1);
        background: var(--neon-blue);
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
    }
}

.radio__input:focus-visible + .radio__mark {
    outline: 2px solid var(--neon-blue);
    outline-offset: 2px;
}

.radio__label {
    font-size: var(--font-body);
    color: var(--text-main);
    transition: color var(--transition-theme);
}
</style>
