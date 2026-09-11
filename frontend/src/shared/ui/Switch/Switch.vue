<template>
    <label class="switch" :class="{ 'switch--disabled': disabled }">
        <input
            type="checkbox"
            :checked="modelValue"
            :disabled="disabled"
            class="switch__input"
            role="switch"
            :aria-checked="modelValue"
            @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        />
        <span class="switch__slider">
            <span class="switch__thumb" />
        </span>
        <span v-if="label || $slots.default" class="switch__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup lang="ts">
interface Props {
    modelValue?: boolean;
    label?: string;
    disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
    modelValue: false,
    label: '',
    disabled: false,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.switch {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-md);
    cursor: pointer;
    user-select: none;
    min-height: 44px;
}

.switch--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.switch__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.switch__slider {
    position: relative;
    flex-shrink: 0;
    width: 44px;
    height: 24px;
    border-radius: var(--radius-full);
    transition: all var(--transition-base);

    body:not(.dark-theme) & {
        background: #d1d5db;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
    }

    body.dark-theme & {
        background: #33333a;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
    }
}

.switch__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #9ca3af;
    transition: all var(--transition-base);

    body.dark-theme & { background: #777; }
}

.switch__input:checked + .switch__slider {
    background: rgba(0, 212, 255, 0.4);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.2), inset 0 0 15px rgba(0, 212, 255, 0.1);
}

.switch__input:checked + .switch__slider .switch__thumb {
    transform: translateX(20px);
    background: var(--neon-blue);
    box-shadow: 0 0 15px var(--neon-blue);
}

.switch__input:focus-visible + .switch__slider {
    outline: 2px solid var(--neon-blue);
    outline-offset: 2px;
}

.switch__label {
    font-size: var(--font-body);
    color: var(--text-main);
}
</style>