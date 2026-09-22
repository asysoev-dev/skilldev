<template>
    <div class="select" :class="{ 'select--open': open, 'select--error': !!error }">
        <label v-if="label" :for="id" class="select__label">{{ label }}</label>

        <button
            :id="id"
            ref="triggerRef"
            type="button"
            class="select__trigger"
            :aria-expanded="open"
            :aria-invalid="!!error"
            @click="toggle"
        >
            <span class="select__value" :class="{ 'select__value--placeholder': !selectedLabel }">
                {{ selectedLabel || placeholder }}
            </span>
            <ChevronDownIcon class="select__chevron" />
        </button>

        <Transition name="select">
            <div v-if="open" ref="menuRef" class="select__menu">
                <button
                    v-for="option in options"
                    :key="option.value"
                    type="button"
                    class="select__option"
                    :class="{ 'select__option--active': option.value === modelValue }"
                    @click="select(option.value)"
                >
                    {{ option.label }}
                </button>
            </div>
        </Transition>

        <p class="select__message" :class="{ 'select__message--error': !!error }">
            {{ error || '\u00A0' }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useId } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import type { SelectOption } from './Select.types';

interface Props {
    modelValue: string | null;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    error?: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: 'Выберите...',
    error: '',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'blur'): void;
}>();

const id = `select-${useId()}`;
const open = ref(false);
const triggerRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
    const found = props.options.find((o) => o.value === props.modelValue);
    return found?.label ?? '';
});

const toggle = () => {
    open.value = !open.value;
};

const select = (value: string) => {
    emit('update:modelValue', value);
    emit('blur');
    open.value = false;
};

const onClickOutside = (e: MouseEvent) => {
    if (!open.value) return;
    const target = e.target as Node;
    if (triggerRef.value?.contains(target) || menuRef.value?.contains(target)) return;
    open.value = false;
};

const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') open.value = false;
};

onMounted(() => {
    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onEsc);
});

onUnmounted(() => {
    document.removeEventListener('click', onClickOutside);
    document.removeEventListener('keydown', onEsc);
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.select {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.select__label {
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-secondary);
}

.select__trigger {
    @include focus-ring;
    @include flex(row, space-between, center);

    gap: 8px;
    width: 100%;
    min-height: 44px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-family: inherit;
    font-size: var(--font-body);
    text-align: left;
    cursor: pointer;
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

    &:hover {
        border-color: var(--neon-blue);
    }
}

.select--open .select__trigger {
    border-color: var(--neon-blue);

    body:not(.dark-theme) & {
        box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.15);
    }

    body.dark-theme & {
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
    }
}

.select--error .select__trigger {
    border-color: var(--neon-pink) !important;
}

.select__value {
    flex: 1;
    color: var(--text-main);
}

.select__value--placeholder {
    color: var(--text-placeholder);
}

.select__chevron {
    width: 16px;
    height: 16px;
    color: var(--text-tertiary);
    flex-shrink: 0;
    transition: transform var(--transition-base);
}

.select--open .select__chevron {
    transform: rotate(180deg);
}

.select__menu {
    @include glass;

    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: $z-dropdown;
    max-height: 260px;
    overflow-y: auto;
    padding: 6px;
    border-radius: var(--radius-md);
    background: var(--bg-main);
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.select__option {
    @include focus-ring;

    padding: 10px 12px;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    text-align: left;
    font-family: inherit;
    font-size: var(--font-small);
    color: var(--text-main);
    cursor: pointer;
    transition: background var(--transition-fast);

    &:hover {
        background: var(--glass-hover);
    }
}

.select__option--active {
    color: var(--neon-blue);
    background: rgba(0, 212, 255, 0.08);
}

.select__message {
    min-height: 20px;
    font-size: var(--font-small);
    line-height: 1.4;
    margin: 0;
    color: transparent;
}

.select__message--error {
    color: var(--neon-pink);
}

.select-enter-active,
.select-leave-active {
    transition: opacity var(--transition-fast);
}

.select-enter-from,
.select-leave-to {
    opacity: 0;
}
</style>
