<template>
    <div class="search-input" :class="{ 'search-input--focused': focused }">
        <MagnifyingGlassIcon class="search-input__icon" />
        <input
            ref="inputRef"
            :value="modelValue"
            type="text"
            class="search-input__field"
            :placeholder="placeholder"
            @input="onInput"
            @focus="focused = true"
            @blur="focused = false"
        />
        <button
            v-if="modelValue"
            type="button"
            class="search-input__clear"
            aria-label="Очистить"
            @click="clear"
        >
            <XMarkIcon class="search-input__clear-icon" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';

interface Props {
    modelValue: string;
    placeholder?: string;
    debounce?: number;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Поиск...',
    debounce: 300,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'debounced', value: string): void;
}>();

const focused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
let timer: number | null = null;

const onInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    emit('update:modelValue', value);

    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
        emit('debounced', value);
    }, props.debounce);
};

const clear = () => {
    emit('update:modelValue', '');
    emit('debounced', '');
    inputRef.value?.focus();
};

onUnmounted(() => {
    if (timer) clearTimeout(timer);
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.search-input {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    width: 100%;
    min-height: 44px;
    padding: 0 12px;
    border-radius: var(--radius-md);
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

.search-input--focused {
    border-color: var(--neon-blue);

    body:not(.dark-theme) & {
        box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.15);
    }

    body.dark-theme & {
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
    }

    .search-input__icon {
        color: var(--neon-blue);
    }
}

.search-input__icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: var(--text-tertiary);
    transition: color var(--transition-base);
}

.search-input__field {
    flex: 1;
    padding: 10px 0;
    background: transparent;
    border: none;
    outline: none;
    font-size: var(--font-body);
    color: var(--text-main);

    &::placeholder {
        color: var(--text-tertiary);
    }
}

.search-input__clear {
    @include focus-ring;
    @include flex(row, center, center);

    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-tertiary);
    cursor: pointer;
    transition: color var(--transition-base);

    &:hover {
        color: var(--text-main);
    }
}

.search-input__clear-icon {
    width: 16px;
    height: 16px;
}
</style>