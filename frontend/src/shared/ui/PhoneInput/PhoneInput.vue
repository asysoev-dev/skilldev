<template>
    <div class="phone-input" :class="{ 'phone-input--error': !!error }">
        <label v-if="label" :for="id" class="phone-input__label">{{ label }}</label>

        <input
            :id="id"
            ref="inputRef"
            :value="modelValue"
            type="tel"
            inputmode="tel"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :aria-invalid="!!error"
            class="phone-input__control"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
        />

        <p v-if="error" class="phone-input__error">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue';

interface Props {
    modelValue?: string;
    label?: string;
    placeholder?: string;
    error?: string;
    autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: '+7 (___) ___-__-__',
    error: '',
    autocomplete: 'tel',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'clear'): void;
    (e: 'blur', event: FocusEvent): void;
    (e: 'focus', event: FocusEvent): void;
}>();

const id = `phone-${useId()}`;
const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);

const extractDigits = (value: string): string => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (digits && !digits.startsWith('7')) digits = '7' + digits;
    return digits.slice(0, 11);
};

const format = (digits: string): string => {
    if (!digits) return '';

    const rest = digits.slice(1);
    let result = '+7';

    if (rest.length > 0) result += ' (' + rest.slice(0, 3);
    if (rest.length >= 3) result += ')';
    if (rest.length > 3) result += ' ' + rest.slice(3, 6);
    if (rest.length > 6) result += '-' + rest.slice(6, 8);
    if (rest.length > 8) result += '-' + rest.slice(8, 10);

    return result;
};

const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const digits = extractDigits(target.value);
    const formatted = format(digits);

    // принудительно синхронизируем нативный input, если значение обрезано
    if (target.value !== formatted) {
        target.value = formatted;
    }

    emit('update:modelValue', formatted);
};

const onBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emit('blur', event);
};

const onFocus = (event: FocusEvent) => {
    isFocused.value = true;
    emit('focus', event);
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.phone-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.phone-input__label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-secondary);
}

.phone-input__control {
    width: 100%;
    min-height: 44px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-size: var(--font-body);
    font-family: inherit;
    color: var(--text-main);
    outline: none;
    transition: all var(--transition-base);

    body:not(.dark-theme) & {
        background: #fff;
        border: 1px solid var(--border-color);
    }

    body.dark-theme & {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
    }

    &::placeholder {
        color: var(--text-placeholder);
        opacity: 1;
    }

    &:hover {
        border-color: var(--neon-blue);
    }

    &:focus {
        border-color: var(--neon-blue);

        body:not(.dark-theme) & {
            box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.15);
        }

        body.dark-theme & {
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }
    }
}

.phone-input--error .phone-input__control {
    border-color: var(--neon-pink) !important;
}

.phone-input__error {
    font-size: var(--font-small);
    color: var(--neon-pink);
    margin: 0;
}
</style>
