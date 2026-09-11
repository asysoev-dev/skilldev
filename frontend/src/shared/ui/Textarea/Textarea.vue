<template>
    <div class="textarea-wrapper" :class="{ 'textarea-wrapper--error': hasError }">
        <label v-if="label" :for="textareaId" class="textarea-wrapper__label">
            {{ label }}
        </label>

        <div class="textarea-wrapper__field" :class="fieldClasses">
            <textarea
                :id="textareaId"
                ref="textareaRef"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :rows="rows"
                :aria-invalid="hasError"
                class="textarea-wrapper__input"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
            />
        </div>

        <p v-if="hasError" class="textarea-wrapper__error">{{ error }}</p>
        <p v-else-if="hint" class="textarea-wrapper__hint">{{ hint }}</p>
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
    (e: 'update:modelValue', value: string): void;
    (e: 'focus', event: FocusEvent): void;
    (e: 'blur', event: FocusEvent): void;
}>();

const textareaId = `textarea-${useId()}`;
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isFocused = ref(false);

const hasError = computed(() => !!props.error);

const fieldClasses = computed(() => ({
    'textarea-wrapper__field--focused': isFocused.value,
    'textarea-wrapper__field--disabled': props.disabled,
    'textarea-wrapper__field--error': hasError.value,
}));

const onInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit('update:modelValue', target.value);
};

const onFocus = (event: FocusEvent) => {
    isFocused.value = true;
    emit('focus', event);
};

const onBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emit('blur', event);
};

defineExpose({ focus: () => textareaRef.value?.focus() });
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.textarea-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    width: 100%;
}

.textarea-wrapper__label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-secondary);
}

.textarea-wrapper__field {
    display: flex;
    width: 100%;
    border-radius: var(--radius-md);
    transition: all var(--transition-base);

    body:not(.dark-theme) & {
        background: #ffffff;
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    body.dark-theme & {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
    }

    &:hover:not(.textarea-wrapper__field--disabled) {
        border-color: var(--neon-blue);
    }
}

.textarea-wrapper__field--focused {
    border-color: var(--neon-blue) !important;

    body:not(.dark-theme) & {
        box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.15);
    }
    body.dark-theme & {
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
    }
}

.textarea-wrapper__field--error {
    border-color: var(--neon-red) !important;

    body:not(.dark-theme) & {
        box-shadow: 0 0 0 4px rgba(255, 59, 92, 0.15);
    }
    body.dark-theme & {
        box-shadow: 0 0 20px rgba(255, 59, 92, 0.2);
    }
}

.textarea-wrapper__field--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.textarea-wrapper__input {
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
        color: var(--text-tertiary);
    }
}

.textarea-wrapper__error {
    font-size: var(--font-small);
    color: var(--neon-red);
    margin: 0;
}

.textarea-wrapper__hint {
    font-size: var(--font-small);
    color: var(--text-tertiary);
    margin: 0;
}

.textarea-wrapper--error .textarea-wrapper__label {
    color: var(--neon-red);
}
</style>
