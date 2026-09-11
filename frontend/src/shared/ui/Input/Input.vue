<template>
    <div class="input" :class="{ 'input--error': !!error }">
        <label v-if="label" :for="id" class="input__label">{{ label }}</label>

        <div class="input__field" :class="fieldClasses">
            <span v-if="iconLeft" class="input__icon input__icon--left">
                <component :is="iconLeft" />
            </span>

            <input
                :id="id"
                ref="inputRef"
                :type="actualType"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :autocomplete="autocomplete"
                :aria-invalid="!!error"
                :aria-describedby="describedBy"
                class="input__control"
                @input="onInput"
                @focus="isFocused = true"
                @blur="isFocused = false"
            />

            <button
                v-if="clearable && modelValue && !disabled"
                type="button"
                class="input__action"
                aria-label="Очистить"
                @click="onClear"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <button
                v-if="type === 'password'"
                type="button"
                class="input__action"
                :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                @click="showPassword = !showPassword"
            >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </button>

            <span v-if="iconRight && !clearable" class="input__icon input__icon--right">
                <component :is="iconRight" />
            </span>
        </div>

        <p v-if="error" :id="`${id}-error`" class="input__error">{{ error }}</p>
        <p v-else-if="hint" :id="`${id}-hint`" class="input__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import type { Component } from 'vue';

interface Props {
    modelValue?: string | number;
    type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
    label?: string;
    placeholder?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    autocomplete?: string;
    iconLeft?: Component;
    iconRight?: Component;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    type: 'text',
    label: '',
    placeholder: '',
    hint: '',
    error: '',
    disabled: false,
    readonly: false,
    clearable: false,
    autocomplete: 'off',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'clear'): void;
}>();

const id = `input-${useId()}`;
const inputRef = ref<HTMLInputElement | null>(null);
const showPassword = ref(false);
const isFocused = ref(false);

const actualType = computed(() =>
    props.type === 'password' && showPassword.value ? 'text' : props.type
);

const describedBy = computed(() =>
    props.error ? `${id}-error` : props.hint ? `${id}-hint` : undefined
);

const fieldClasses = computed(() => ({
    'input__field--focused': isFocused.value,
    'input__field--disabled': props.disabled,
    'input__field--error': !!props.error,
}));

const onInput = (e: Event) => {
    const t = e.target as HTMLInputElement;
    emit('update:modelValue', props.type === 'number' ? Number(t.value) : t.value);
};

const onClear = () => {
    emit('update:modelValue', '');
    emit('clear');
    inputRef.value?.focus();
};

defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.input {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    width: 100%;
}

.input__label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-secondary);
}

.input__field {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 44px;
    border-radius: var(--radius-md);
    transition: all var(--transition-base);

    body:not(.dark-theme) & {
        background: #fff;
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    body.dark-theme & {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
    }

    &:hover:not(.input__field--disabled) {
        border-color: var(--neon-blue);
    }
}

.input__field--focused {
    border-color: var(--neon-blue) !important;

    body:not(.dark-theme) & {
        box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.15), 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    body.dark-theme & {
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.2), inset 0 0 15px rgba(0, 212, 255, 0.05);
    }
}

.input__field--error {
    border-color: var(--neon-red) !important;

    body:not(.dark-theme) & {
        box-shadow: 0 0 0 4px rgba(255, 59, 92, 0.15);
    }

    body.dark-theme & {
        box-shadow: 0 0 20px rgba(255, 59, 92, 0.2);
    }
}

.input__field--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.input__control {
    flex: 1;
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    outline: none;
    font-size: var(--font-body);
    color: var(--text-main);

    &::placeholder {
        color: var(--text-tertiary);
    }

    &:disabled {
        cursor: not-allowed;
    }
}

.input__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
    pointer-events: none;
    transition: color var(--transition-base);

    :deep(svg) {
        width: 100%;
        height: 100%;
    }
}

.input__icon--left { margin-left: 16px; margin-right: 8px; }
.input__icon--right { margin-right: 16px; margin-left: 8px; }

.input__field--focused .input__icon {
    color: var(--neon-blue);
}

.input__action {
    @include flex(row, center, center);
    @include focus-ring;

    flex-shrink: 0;
    width: 44px;
    height: 44px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-tertiary);
    cursor: pointer;
    transition: color var(--transition-base);

    &:hover {
        color: var(--neon-blue);
    }

    svg {
        width: 18px;
        height: 18px;
    }
}

.input__error {
    font-size: var(--font-small);
    color: var(--neon-red);
    margin: 0;
}

.input__hint {
    font-size: var(--font-small);
    color: var(--text-tertiary);
    margin: 0;
}

.input--error .input__label {
    color: var(--neon-red);
}
</style>