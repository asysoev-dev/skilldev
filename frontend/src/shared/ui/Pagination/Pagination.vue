<template>
    <div class="pagination tour__step-7">
        <div class="pagination__info">Показано {{ rangeStart }}–{{ rangeEnd }} из {{ total }}</div>

        <div class="pagination__controls">
            <button
                type="button"
                class="pagination__btn"
                :disabled="page === 1"
                aria-label="Назад"
                @click="emit('update:page', page - 1)"
            >
                <ChevronLeftIcon />
            </button>

            <template v-for="p in pages" :key="p">
                <span v-if="p === '...'" class="pagination__ellipsis">…</span>
                <button
                    v-else
                    type="button"
                    class="pagination__btn pagination__btn--page"
                    :class="{ 'pagination__btn--active': p === page }"
                    @click="emit('update:page', p as number)"
                >
                    {{ p }}
                </button>
            </template>

            <button
                type="button"
                class="pagination__btn"
                :disabled="page === totalPages"
                aria-label="Вперёд"
                @click="emit('update:page', page + 1)"
            >
                <ChevronRightIcon />
            </button>
        </div>

        <select class="pagination__limit" :value="limit" @change="onLimitChange">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

interface Props {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'update:page', value: number): void;
    (e: 'update:limit', value: number): void;
}>();

const rangeStart = computed(() => (props.page - 1) * props.limit + 1);
const rangeEnd = computed(() => Math.min(props.page * props.limit, props.total));

const pages = computed<(number | '...')[]>(() => {
    const total = props.totalPages;
    const current = props.page;

    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const result: (number | '...')[] = [1];

    if (current > 4) result.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) result.push(i);

    if (current < total - 3) result.push('...');
    result.push(total);

    return result;
});

const onLimitChange = (e: Event) => {
    const value = Number((e.target as HTMLSelectElement).value);
    emit('update:limit', value);
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-md);
}

.pagination__info {
    font-size: var(--font-small);
    color: var(--text-secondary);
}

.pagination__controls {
    display: flex;
    align-items: center;
    gap: 4px;
}

.pagination__btn {
    @include focus-ring;
    @include flex(row, center, center);

    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: var(--font-small);
    font-family: inherit;
    cursor: pointer;
    transition: all var(--transition-fast);

    svg {
        width: 16px;
        height: 16px;
    }

    &:hover:not(:disabled) {
        background: var(--glass-hover);
        color: var(--text-main);
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
}

.pagination__btn--page {
    font-weight: 500;
}

.pagination__btn--active {
    background: var(--neon-blue);
    color: #08080c;
    border-color: var(--neon-blue);

    &:hover {
        background: var(--neon-blue);
        color: #08080c;
    }
}

.pagination__ellipsis {
    padding: 0 4px;
    color: var(--text-tertiary);
}

.pagination__limit {
    min-height: 36px;
    padding: 0 8px;
    background: transparent;
    border-radius: var(--radius-md);
    font-family: inherit;
    font-size: var(--font-small);
    color: var(--text-main);
    cursor: pointer;
    outline: none;
    color-scheme: light;

    body:not(.dark-theme) & {
        background: #fff;
        border: 1px solid var(--border-color);
    }

    body.dark-theme & {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        color-scheme: dark;
    }

    option {
        background: var(--bg-main);
        color: var(--text-main);
    }
}
</style>
