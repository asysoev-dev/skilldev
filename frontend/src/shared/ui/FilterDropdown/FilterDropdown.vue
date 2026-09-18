<template>
    <div class="filter-dropdown" :class="{ 'filter-dropdown--open': open }">
        <button
            type="button"
            class="filter-dropdown__trigger"
            :class="{ 'filter-dropdown__trigger--active': !!modelValue }"
            @click.stop="open = !open"
        >
            <span class="filter-dropdown__label">{{ label }}</span>
            <span v-if="modelValue" class="filter-dropdown__value">{{ modelValue }}</span>
            <ChevronDownIcon class="filter-dropdown__chevron" />
        </button>

        <Transition name="dropdown">
            <div v-if="open" class="filter-dropdown__menu" @click.stop>
                <button
                    type="button"
                    class="filter-dropdown__item"
                    :class="{ 'filter-dropdown__item--active': !modelValue }"
                    @click="select(null)"
                >
                    Все
                </button>
                <button
                    v-for="option in options"
                    :key="option"
                    type="button"
                    class="filter-dropdown__item"
                    :class="{ 'filter-dropdown__item--active': modelValue === option }"
                    @click="select(option)"
                >
                    {{ option }}
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

interface Props {
    modelValue: string | null;
    options: string[];
    label: string;
}

defineProps<Props>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void;
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

const select = (value: string | null) => {
    emit('update:modelValue', value);
    open.value = false;
};

const onClickOutside = (e: MouseEvent) => {
    if (!open.value) return;
    const el = e.target as HTMLElement;
    if (el.closest('.filter-dropdown') === root.value) return;
    open.value = false;
};

onMounted(() => document.addEventListener('click', onClickOutside));
onUnmounted(() => document.removeEventListener('click', onClickOutside));
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.filter-dropdown {
    position: relative;
    display: inline-block;
}

.filter-dropdown__trigger {
    @include focus-ring;
    @include flex(row, flex-start, center);

    gap: 8px;
    min-height: 44px;
    padding: 0 12px;
    background: transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-family: inherit;
    font-size: var(--font-small);
    color: var(--text-main);
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

.filter-dropdown__trigger--active {
    border-color: var(--neon-blue);
}

.filter-dropdown__label {
    color: var(--text-secondary);
}

.filter-dropdown__value {
    color: var(--neon-blue);
    font-weight: 500;
}

.filter-dropdown__chevron {
    width: 14px;
    height: 14px;
    color: var(--text-tertiary);
    transition: transform var(--transition-base);
}

.filter-dropdown--open .filter-dropdown__chevron {
    transform: rotate(180deg);
}

.filter-dropdown__menu {
    @include glass;

    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: $z-dropdown;
    min-width: 180px;
    max-height: 280px;
    overflow-y: auto;
    padding: 6px;
    border-radius: var(--radius-md);
    background: var(--bg-main);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.filter-dropdown__item {
    @include focus-ring;

    padding: 8px 12px;
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

.filter-dropdown__item--active {
    color: var(--neon-blue);
    background: rgba(0, 212, 255, 0.08);
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity var(--transition-fast);
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
}
</style>