<template>
    <div class="dashboard">
        <BackToStands />

        <header class="dashboard__header">
            <div>
                <h1 class="dashboard__title">
                    Привет, {{ userStore.user?.name || userStore.user?.email }}
                    <Tag v-if="isDemo" variant="neon-yellow" size="sm">Демо-режим</Tag>
                </h1>
                <p class="dashboard__subtitle">
                    Это админка. Здесь можно создавать, редактировать и удалять лидов.
                </p>
            </div>

            <div class="dashboard__actions">
                <Button
                    v-if="isAdmin"
                    variant="outline"
                    size="sm"
                    :icon-left="ArrowPathIcon"
                    :loading="resetting"
                    @click="handleReset"
                >
                    Сбросить демо-данные
                </Button>
                <Button
                    variant="outline-danger-action"
                    size="sm"
                    :icon-left="ArrowRightStartOnRectangleIcon"
                    @click="handleLogout"
                >
                    Выйти
                </Button>
            </div>
        </header>

        <div class="dashboard__stats">
            <div class="dashboard__stat">
                <span class="dashboard__stat-value">{{ store.total }}</span>
                <span class="dashboard__stat-label">Всего лидов</span>
            </div>
            <div class="dashboard__stat">
                <span class="dashboard__stat-value">{{ wonCount }}</span>
                <span class="dashboard__stat-label">Побед</span>
            </div>
            <div class="dashboard__stat">
                <span class="dashboard__stat-value">{{ formatAmount(wonAmount) }}</span>
                <span class="dashboard__stat-label">Сумма сделок</span>
            </div>
        </div>

        <div class="dashboard__toolbar">
            <SearchInput v-model="store.search" placeholder="Поиск..." @debounced="onSearch" />
            <Button variant="primary" :icon-left="PlusIcon" @click="openCreate">
                Добавить лида
            </Button>
        </div>

        <div class="dashboard__table-wrapper">
            <table class="dashboard__table">
                <thead>
                    <tr>
                        <th>Контакт</th>
                        <th>Статус</th>
                        <th>Менеджер</th>
                        <th>Сумма</th>
                        <th>Создан</th>
                        <th>Автор</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lead in store.items" :key="lead.id">
                        <td>
                            <div class="dashboard__contact">
                                <div class="dashboard__avatar">
                                    {{ lead.firstName[0] }}{{ lead.lastName[0] }}
                                </div>
                                <div>
                                    <div class="dashboard__name">
                                        {{ lead.firstName }} {{ lead.lastName }}
                                    </div>
                                    <div class="dashboard__company">{{ lead.company }}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <Tag :variant="statusVariant(lead.status)" size="sm">
                                {{ statusLabels[lead.status] }}
                            </Tag>
                        </td>
                        <td>{{ lead.manager }}</td>
                        <td class="dashboard__amount">{{ formatAmount(lead.dealAmount) }}</td>
                        <td>{{ formatDate(lead.createdAt) }}</td>
                        <td>
                            <Tag v-if="lead.createdById" variant="neon-green" size="sm">мой</Tag>
                            <Tag v-else variant="default" size="sm">seed</Tag>
                        </td>
                        <td>
                            <div class="dashboard__row-actions">
                                <button
                                    v-if="isAdmin || lead.createdById === userStore.user?.id"
                                    type="button"
                                    class="dashboard__icon-btn"
                                    aria-label="Редактировать"
                                    @click="openEdit(lead)"
                                >
                                    <PencilSquareIcon />
                                </button>
                                <button
                                    v-if="isAdmin || lead.createdById === userStore.user?.id"
                                    type="button"
                                    class="dashboard__icon-btn dashboard__icon-btn--danger"
                                    aria-label="Удалить"
                                    @click="handleDelete(lead)"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="!store.loading && store.items.length === 0" class="dashboard__empty">
                Лидов пока нет. Создай первого.
            </div>
        </div>

        <Pagination
            :page="store.page"
            :limit="store.limit"
            :total="store.total"
            :total-pages="store.totalPages"
            @update:page="onPage"
            @update:limit="onLimit"
        />

        <LeadFormModal
            :open="formOpen"
            :lead="editingLead"
            @close="formOpen = false"
            @saved="onSaved"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowPathIcon,
    ArrowRightStartOnRectangleIcon,
} from '@heroicons/vue/24/outline';
import { BackToStands, Button, SearchInput, Pagination, Tag } from '@shared/ui';
import { LeadFormModal } from '@widgets/leads-table';
import { useLeadStore } from '@entities/lead';
import { useUserStore } from '@entities/user';
import { useAuth } from '@features/auth/model/useAuth';
import { useConfirm } from '@shared/ui';
import type { Lead, LeadStatus } from '@shared/api/leads.api';

const store = useLeadStore();
const userStore = useUserStore();
const { logout } = useAuth();
const { confirm } = useConfirm();

const formOpen = ref(false);
const editingLead = ref<Lead | null>(null);
const resetting = ref(false);

const isAdmin = computed(() => userStore.user?.role === 'admin');
const isDemo = computed(() => userStore.user?.isDemo === true);

const statusLabels: Record<LeadStatus, string> = {
    new: 'Новый',
    contacted: 'Связались',
    qualified: 'Квалифицирован',
    proposal: 'КП отправлено',
    negotiation: 'Переговоры',
    won: 'Сделка закрыта',
    lost: 'Отказ',
};

const statusVariant = (status: LeadStatus) => {
    if (status === 'won') return 'neon-green';
    if (status === 'lost') return 'neon-pink';
    if (status === 'negotiation' || status === 'proposal') return 'neon-yellow';
    return 'neon-blue';
};

const wonCount = computed(() => store.items.filter((l) => l.status === 'won').length);
const wonAmount = computed(() =>
    store.items.filter((l) => l.status === 'won').reduce((sum, l) => sum + l.dealAmount, 0)
);

const formatAmount = (amount: number) =>
    new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(amount) + ' ₽';

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });

const onSearch = () => {
    store.setSearch(store.search);
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

const openCreate = () => {
    editingLead.value = null;
    formOpen.value = true;
};

const openEdit = (lead: Lead) => {
    editingLead.value = lead;
    formOpen.value = true;
};

const onSaved = () => {
    store.fetchLeads();
};

const handleDelete = async (lead: Lead) => {
    const ok = await confirm({
        title: 'Удалить лида?',
        text: `Лид «${lead.firstName} ${lead.lastName}» будет удалён безвозвратно.`,
        confirmText: 'Удалить',
        cancelText: 'Отмена',
        variant: 'danger',
    });
    if (!ok) return;

    try {
        await store.deleteLead(lead.id);
    } catch (e) {
        console.error(e);
    }
};

const handleReset = async () => {
    const ok = await confirm({
        title: 'Сбросить демо-данные?',
        text: 'Все текущие лиды будут удалены и создано 140 новых.',
        confirmText: 'Сбросить',
        variant: 'danger',
    });
    if (!ok) return;

    resetting.value = true;
    try {
        await store.resetLeads();
    } finally {
        resetting.value = false;
    }
};

const handleLogout = async () => {
    await logout();
};

onMounted(() => {
    store.fetchLeads();
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.dashboard {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    padding: var(--section-spacing) 0;
}

.dashboard__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-md);
    flex-wrap: wrap;
}

.dashboard__title {
    font-size: var(--font-h2);
    font-weight: 600;
    margin: 0 0 var(--gap-sm);
}

.dashboard__subtitle {
    font-size: var(--font-small);
    color: var(--text-secondary);
    margin: 0;
}

.dashboard__actions {
    display: flex;
    gap: var(--gap-sm);
    flex-wrap: wrap;
}

.dashboard__stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-sm);

    @include respond(tablet) {
        grid-template-columns: repeat(3, 1fr);
    }
}

.dashboard__stat {
    @include glass;
    padding: var(--gap-md);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.dashboard__stat-value {
    font-size: var(--font-h3);
    font-weight: 700;
    color: var(--neon-blue);
}

.dashboard__stat-label {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
}

.dashboard__toolbar {
    display: flex;
    gap: var(--gap-sm);
    flex-wrap: wrap;

    :deep(.search-input) {
        flex: 1;
        min-width: 240px;
    }

    @include respond-down(tablet) {
        flex-direction: column;

        :deep(.search-input) {
            min-width: 0;
        }
    }
}

.dashboard__table-wrapper {
    overflow-x: auto;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
}

.dashboard__table {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
}

.dashboard__table th {
    padding: 12px 16px;
    text-align: left;
    font-size: var(--font-tiny);
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--footer-border);
    white-space: nowrap;
}

.dashboard__table td {
    padding: 12px 16px;
    font-size: var(--font-small);
    color: var(--text-main);
    border-bottom: 1px solid var(--footer-border);
    white-space: nowrap;
}

.dashboard__contact {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dashboard__avatar {
    @include flex(row, center, center);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 212, 255, 0.15);
    color: var(--neon-blue);
    font-size: var(--font-tiny);
    font-weight: 600;
    flex-shrink: 0;
}

.dashboard__name {
    font-weight: 500;
}

.dashboard__company {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
}

.dashboard__amount {
    color: var(--neon-green);
    font-weight: 500;
}

.dashboard__row-actions {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
}

.dashboard__icon-btn {
    @include focus-ring;

    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all var(--transition-base);

    svg {
        width: 16px;
        height: 16px;
    }

    &:hover {
        color: var(--neon-blue);
        background: rgba(0, 212, 255, 0.08);
    }
}

.dashboard__icon-btn--danger:hover {
    color: var(--neon-pink);
    background: rgba(255, 45, 149, 0.08);
}

.dashboard__empty {
    padding: var(--section-spacing);
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--font-small);
}
</style>
