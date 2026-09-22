<template>
    <div class="textarea" :class="{ 'textarea--error': !!error }">
        <label v-if="label" :for="id" class="textarea__label">{{ label }}</label>

        <div class="textarea__field" :class="fieldClasses">
            <textarea
                :id="id"
                ref="textareaRef"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :rows="rows"
                :aria-invalid="!!error"
                class="textarea__control"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
            />
        </div>

        <p class="textarea__message" :class="messageClass" :id="messageId">
            {{ messageText || '\u00A0' }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';

interface Props {
    modelValue?: string;
    label?: string;
    placeholder?: string;
    hint?: string;
    error?: string;
    rows?: number;
    disabled?: boolean;
    readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: '',
    hint: '',
    error: '',
    rows: 4,
    disabled: false,
    readonly: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'clear'): void;
    (e: 'blur', event: FocusEvent): void;
    (e: 'focus', event: FocusEvent): void;
}>();

const id = `textarea-${useId()}`;
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isFocused = ref(false);

const fieldClasses = computed(() => ({
    'textarea__field--focused': isFocused.value,
    'textarea__field--disabled': props.disabled,
    'textarea__field--error': !!props.error,
}));

const messageText = computed(() => {
    if (props.error) return props.error;
    if (props.hint) return props.hint;
    return '';
});

const messageClass = computed(() => ({
    'textarea__message--error': !!props.error,
    'textarea__message--hint': !props.error && !!props.hint,
}));

const messageId = computed(() =>
    props.error ? `${id}-error` : props.hint ? `${id}-hint` : undefined
);

const onInput = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLTextAreaElement).value);
};

const onBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emit('blur', event);
};

const onFocus = (event: FocusEvent) => {
    isFocused.value = true;
    emit('focus', event);
};

defineExpose({ focus: () => textareaRef.value?.focus() });
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.textarea {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    width: 100%;
}

.textarea__label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-secondary);
}

.textarea__field {
    display: flex;
    width: 100%;
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

    &:hover:not(.textarea__field--disabled) {
        border-color: var(--neon-blue);
    }
}

.textarea__field--focused {
    border-color: var(--neon-blue) !important;

    body:not(.dark-theme) & {
        box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.15);
    }
    body.dark-theme & {
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
    }
}

.textarea__field--error {
    border-color: var(--neon-red) !important;

    body:not(.dark-theme) & {
        box-shadow: 0 0 0 4px rgba(255, 59, 92, 0.15);
    }
    body.dark-theme & {
        box-shadow: 0 0 20px rgba(255, 59, 92, 0.2);
    }
}

.textarea__field--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.textarea__control {
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    outline: none;
    font-size: var(--font-body);
    font-family: inherit;
    color: var(--text-main);
    resize: vertical;
    min-height: 88px;

    &::placeholder {
        color: var(--text-placeholder);
    }
}

.textarea__message {
    min-height: 20px;
    font-size: var(--font-small);
    line-height: 1.4;
    margin: 0;
    color: transparent;
}

.textarea__message--error {
    color: var(--neon-pink);
}

.textarea__message--hint {
    color: var(--text-tertiary);
}

.textarea--error .textarea__label {
    color: var(--neon-red);
}
</style>
