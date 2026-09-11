<template>
    <div class="input-wrapper" :class="{ 'input-wrapper--error': hasError }">
        <label v-if="label" :for="inputId" class="input-wrapper__label">
            {{ label }}
        </label>

        <div class="input-wrapper__field" :class="fieldClasses">
            <span v-if="iconLeft" class="input-wrapper__icon input-wrapper__icon--left">
                <component :is="iconLeft" />
            </span>

            <input
                :id="inputId"
                ref="inputRef"
                :type="actualType"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :autocomplete="autocomplete"
                :aria-invalid="hasError"
                :aria-describedby="describedBy"
                class="input-wrapper__input"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
            />

            <button
                v-if="clearable && modelValue && !disabled"
                type="button"
                class="input-wrapper__action"
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
                class="input-wrapper__action"
                :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                @click="showPassword = !showPassword"
            >
                <svg
                    v-if="showPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </button>

            <span
                v-if="iconRight && !clearable"
                class="input-wrapper__icon input-wrapper__icon--right"
            >
                <component :is="iconRight" />
            </span>
        </div>

        <p v-if="hasError" :id="`${inputId}-error`" class="input-wrapper__error">
            {{ error }}
        </p>
        <p v-else-if="hint" :id="`${inputId}-hint`" class="input-wrapper__hint">
            {{ hint }}
        </p>
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
    (e: 'focus', event: FocusEvent): void;
    (e: 'blur', event: FocusEvent): void;
    (e: 'clear'): void;
}>();

const inputId = `input-${useId()}`;
const inputRef = ref<HTMLInputElement | null>(null);
const showPassword = ref(false);
const isFocused = ref(false);

const hasError = computed(() => !!props.error);

const actualType = computed(() => {
    if (props.type === 'password') {
        return showPassword.value ? 'text' : 'password';
    }
    return props.type;
});

const describedBy = computed(() => {
    if (hasError.value) return `${inputId}-error`;
    if (props.hint) return `${inputId}-hint`;
    return undefined;
});

const fieldClasses = computed(() => ({
    'input-wrapper__field--focused': isFocused.value,
    'input-wrapper__field--disabled': props.disabled,
    'input-wrapper__field--error': hasError.value,
}));

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = props.type === 'number' ? Number(target.value) : target.value;
    emit('update:modelValue', value);
};

const onFocus = (event: FocusEvent) => {
    isFocused.value = true;
    emit('focus', event);
};

const onBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emit('blur', event);
};

const onClear = () => {
    emit('update:modelValue', '');
    emit('clear');
    inputRef.value?.focus();
};

defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    width: 100%;
}

.input-wrapper__label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-secondary);
    transition: color var(--transition-theme);
}

.input-wrapper__field {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 44px;
    border-radius: var(--radius-md);
    transition: all var(--transition-base);

    // Светлая тема — плотный белый фон
    body:not(.dark-theme) & {
        background: #ffffff;
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    // Тёмная тема — стекло
    body.dark-theme & {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
    }

    &:hover:not(.input-wrapper__field--disabled) {
        border-color: var(--neon-blue);
    }
}

.input-wrapper__field--focused {
    border-color: var(--neon-blue) !important;

    body:not(.dark-theme) & {
        box-shadow:
            0 0 0 4px rgba(0, 212, 255, 0.15),
            0 2px 4px rgba(0, 0, 0, 0.02);
    }

    body.dark-theme & {
        box-shadow:
            0 0 20px rgba(0, 212, 255, 0.2),
            inset 0 0 15px rgba(0, 212, 255, 0.05);
    }
}

.input-wrapper__field--error {
    border-color: var(--neon-red) !important;

    body:not(.dark-theme) & {
        box-shadow: 0 0 0 4px rgba(255, 59, 92, 0.15);
    }
    body.dark-theme & {
        box-shadow: 0 0 20px rgba(255, 59, 92, 0.2);
    }
}

.input-wrapper__field--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.input-wrapper__input {
    flex: 1;
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    outline: none;
    font-size: var(--font-body);
    color: var(--text-main);
    font-family: inherit;

    &::placeholder {
        color: var(--text-tertiary);
    }

    &:disabled {
        cursor: not-allowed;
    }
}

.input-wrapper__icon {
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

.input-wrapper__icon--left {
    margin-left: 16px;
    margin-right: 8px;
}

.input-wrapper__icon--right {
    margin-right: 16px;
    margin-left: 8px;
}

.input-wrapper__field--focused .input-wrapper__icon {
    color: var(--neon-blue);
}

.input-wrapper__action {
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

.input-wrapper__error {
    font-size: var(--font-small);
    color: var(--neon-red);
    margin: 0;
}

.input-wrapper__hint {
    font-size: var(--font-small);
    color: var(--text-tertiary);
    margin: 0;
}

.input-wrapper--error .input-wrapper__label {
    color: var(--neon-red);
}
</style>
