<template>
    <div class="data-table">
        <div class="data-table__wrapper">
            <table class="data-table__table">
                <thead>
                    <tr class="tour__step-6">
                        <th
                            v-for="col in columns"
                            :key="col.key"
                            class="data-table__th"
                            :class="{ 'data-table__th--sortable': col.sortable }"
                            @click="col.sortable && onSort(col.key)"
                        >
                            <span>{{ col.label }}</span>
                            <component
                                v-if="col.sortable && store.sortBy === col.key"
                                :is="store.order === 'asc' ? ChevronUpIcon : ChevronDownIcon"
                                class="data-table__sort-icon"
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="lead in store.items"
                        :key="lead.id"
                        class="data-table__row"
                        @click="store.openLead(lead.id)"
                    >
                        <td class="data-table__td">
                            <div class="data-table__contact">
                                <div class="data-table__avatar">
                                    {{ lead.firstName[0] }}{{ lead.lastName[0] }}
                                </div>
                                <div>
                                    <div class="data-table__name">
                                        {{ lead.firstName }} {{ lead.lastName }}
                                    </div>
                                    <div class="data-table__company">{{ lead.company }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="data-table__td">
                            <Tag :variant="statusVariant(lead.status)" size="sm">{{
                                statusLabels[lead.status]
                            }}</Tag>
                        </td>
                        <td class="data-table__td">{{ lead.manager }}</td>
                        <td class="data-table__td data-table__td--accent">
                            {{ formatAmount(lead.dealAmount) }}
                        </td>
                        <td class="data-table__td">{{ lead.city }}</td>
                        <td class="data-table__td">{{ formatDate(lead.createdAt) }}</td>
                    </tr>
                </tbody>
            </table>

            <div v-if="!store.loading && store.items.length === 0" class="data-table__empty">
                Ничего не найдено
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import { Tag } from '@shared/ui';
import { useLeadStore } from '@entities/lead';
import type { LeadStatus } from '@shared/api/leads.api';
import type { TagVariant, TagSize } from '@shared/ui/Tag';

const store = useLeadStore();

const columns = [
    { key: 'firstName', label: 'Контакт', sortable: true },
    { key: 'statusOrder', label: 'Статус', sortable: true },
    { key: 'manager', label: 'Менеджер', sortable: true },
    { key: 'dealAmount', label: 'Сумма', sortable: true },
    { key: 'city', label: 'Город', sortable: true },
    { key: 'createdAt', label: 'Создан', sortable: true },
];

const statusLabels: Record<string, string> = {
    new: 'Новый',
    contacted: 'Связались',
    qualified: 'Квалифицирован',
    proposal: 'КП отправлено',
    negotiation: 'Переговоры',
    won: 'Сделка закрыта',
    lost: 'Отказ',
};

const statusVariant = (status: LeadStatus): TagVariant => {
    if (status === 'won') return 'neon-green';
    if (status === 'lost') return 'neon-pink';
    if (status === 'negotiation' || status === 'proposal') return 'neon-yellow';
    return 'neon-blue';
};

const formatAmount = (amount: number) =>
    new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(amount) + ' ₽';

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });

const onSort = (key: string) => {
    store.setSort(key);
    store.fetchLeads();
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.data-table__wrapper {
    overflow-x: auto;
    border-radius: var(--radius-md);
}

.data-table__table {
    width: 100%;
    min-width: 800px;
    border-collapse: collapse;
}

.data-table__th {
    padding: 12px 16px;
    text-align: left;
    font-size: var(--font-tiny);
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--footer-border);
    white-space: nowrap;
    user-select: none;
}

.data-table__th--sortable {
    cursor: pointer;

    &:hover {
        color: var(--text-main);
    }
}

.data-table__sort-icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-left: 4px;
    vertical-align: middle;
    color: var(--neon-blue);
}

.data-table__row {
    cursor: pointer;
    transition: background var(--transition-fast);

    &:hover {
        background: var(--glass-hover);
    }
}

.data-table__td {
    padding: 12px 16px;
    font-size: var(--font-small);
    color: var(--text-main);
    border-bottom: 1px solid var(--footer-border);
    white-space: nowrap;
}

.data-table__td--accent {
    color: var(--neon-green);
    font-weight: 500;
}

.data-table__contact {
    display: flex;
    align-items: center;
    gap: 10px;
}

.data-table__avatar {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 212, 255, 0.15);
    color: var(--neon-blue);
    font-size: var(--font-tiny);
    font-weight: 600;
}

.data-table__name {
    font-weight: 500;
    color: var(--text-main);
}

.data-table__company {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
}

.data-table__empty {
    padding: var(--section-spacing) 0;
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--font-small);
}
</style>
