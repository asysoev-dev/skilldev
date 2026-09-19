<template>
    <div class="demo-table">
        <BackToStands />
        <header class="demo-table__header">
            <div>
                <h1 class="demo-table__title">Data Table</h1>
                <p class="demo-table__subtitle">
                    Таблица лидов с поиском, фильтрами, сортировкой и пагинацией.
                </p>
            </div>
            <Button variant="outline" size="sm" :icon-left="ArrowDownTrayIcon" @click="exportCsv">
                Экспорт CSV
            </Button>
        </header>

        <div class="demo-table__notice">
            Все данные вымышленные. Совпадения случайны.
        </div>

        <div class="demo-table__toolbar">
            <SearchInput
                v-model="store.search"
                placeholder="Поиск по имени, компании, email..."
                @debounced="onSearch"
            />

            <FilterDropdown
                :model-value="store.status"
                :options="statusOptions"
                label="Статус"
                @update:model-value="onStatus"
            />

            <FilterDropdown
                :model-value="store.manager"
                :options="store.managers"
                label="Менеджер"
                @update:model-value="onManager"
            />

            <FilterDropdown
                :model-value="store.industry"
                :options="store.industries"
                label="Отрасль"
                @update:model-value="onIndustry"
            />

            <button
                v-if="store.hasActiveFilters"
                type="button"
                class="demo-table__reset"
                @click="resetFilters"
            >
                Сбросить
            </button>
        </div>

        <DataTable />

        <Pagination
            :page="store.page"
            :limit="store.limit"
            :total="store.total"
            :total-pages="store.totalPages"
            @update:page="onPage"
            @update:limit="onLimit"
        />

        <LeadModal :lead="store.selectedLead" @close="store.closeLead()" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import { Button, SearchInput, FilterDropdown, Pagination } from '@shared/ui';
import { DataTable, LeadModal } from '@widgets/leads-table';
import { useLeadStore } from '@entities/lead';
import type { LeadStatus } from '@shared/api/leads.api';
import { BackToStands } from '@shared/ui';

const store = useLeadStore();

const statusOptions = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

const onSearch = () => {
    store.setSearch(store.search);
    store.fetchLeads();
};

const onStatus = (value: string | null) => {
    store.setStatus(value as LeadStatus | null);
    store.fetchLeads();
};

const onManager = (value: string | null) => {
    store.setManager(value);
    store.fetchLeads();
};

const onIndustry = (value: string | null) => {
    store.setIndustry(value);
    store.fetchLeads();
};

const onPage = (page: number) => {
    store.setPage(page);
    store.fetchLeads();
};

const onLimit = (limit: number) => {
    store.setLimit(limit);
    store.fetchLeads();
};

const resetFilters = () => {
    store.resetFilters();
    store.fetchLeads();
};

const exportCsv = () => {
    const headers = ['ID', 'Имя', 'Фамилия', 'Email', 'Компания', 'Должность', 'Статус', 'Менеджер', 'Сумма', 'Город'];
    const rows = store.items.map((l) => [
        l.id, l.firstName, l.lastName, l.email, l.company, l.position,
        l.status, l.manager, l.dealAmount, l.city,
    ]);

    const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

onMounted(() => {
    store.fetchLeads();
    store.fetchFilters();
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.demo-table {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    padding: var(--section-spacing) 0;
}

.demo-table__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-md);
    flex-wrap: wrap;
}

.demo-table__title {
    font-size: var(--font-h1);
    font-weight: 600;
    margin: 0 0 var(--gap-sm);
}

.demo-table__subtitle {
    font-size: var(--font-body);
    color: var(--text-secondary);
    margin: 0;
}

.demo-table__notice {
    padding: 10px 16px;
    border-radius: var(--radius-md);
    background: rgba(255, 215, 0, 0.08);
    border: 1px solid rgba(255, 215, 0, 0.2);
    font-size: var(--font-small);
    color: var(--text-secondary);
}

.demo-table__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    align-items: center;
}

.demo-table__reset {
    @include focus-ring;

    padding: 0 12px;
    min-height: 44px;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-family: inherit;
    font-size: var(--font-small);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-base);

    &:hover {
        color: var(--neon-pink);
        border-color: var(--neon-pink);
    }
}
</style>