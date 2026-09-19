<template>
    <Teleport v-if="lead" to="body">
        <Transition name="modal">
            <div v-if="lead" class="lead-modal" @click.self="close">
                <div class="lead-modal__panel">
                    <header class="lead-modal__header">
                        <div>
                            <h2 class="lead-modal__name">
                                {{ lead.firstName }} {{ lead.lastName }}
                            </h2>
                            <p class="lead-modal__position">
                                {{ lead.position }} · {{ lead.company }}
                            </p>
                        </div>
                        <button
                            type="button"
                            class="lead-modal__close"
                            aria-label="Закрыть"
                            @click="close"
                        >
                            <XMarkIcon />
                        </button>
                    </header>

                    <div class="lead-modal__grid">
                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Email</span>
                            <a :href="`mailto:${lead.email}`" class="lead-modal__value lead-modal__value--link">
                                {{ lead.email }}
                            </a>
                        </div>

                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Телефон</span>
                            <a :href="`tel:${lead.phone}`" class="lead-modal__value lead-modal__value--link">
                                {{ lead.phone || '—' }}
                            </a>
                        </div>

                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Источник</span>
                            <Tag :variant="sourceVariant" size="sm">{{ sourceLabels[lead.source] }}</Tag>
                        </div>

                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Статус</span>
                            <Tag :variant="statusVariant" size="sm">{{ statusLabels[lead.status] }}</Tag>
                        </div>

                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Менеджер</span>
                            <span class="lead-modal__value">{{ lead.manager }}</span>
                        </div>

                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Сумма сделки</span>
                            <span class="lead-modal__value lead-modal__value--accent">
                                {{ formatAmount(lead.dealAmount) }}
                            </span>
                        </div>

                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Город</span>
                            <span class="lead-modal__value">{{ lead.city }}</span>
                        </div>

                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Отрасль</span>
                            <span class="lead-modal__value">{{ lead.industry }}</span>
                        </div>

                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Создан</span>
                            <span class="lead-modal__value">{{ formatDate(lead.createdAt) }}</span>
                        </div>

                        <div class="lead-modal__field">
                            <span class="lead-modal__label">Закрыт</span>
                            <span class="lead-modal__value">{{ lead.closedAt ? formatDate(lead.closedAt) : '—' }}</span>
                        </div>
                    </div>

                    <div v-if="lead.notes" class="lead-modal__notes">
                        <span class="lead-modal__label">Заметки</span>
                        <p class="lead-modal__notes-text">{{ lead.notes }}</p>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { Tag } from '@shared/ui';
import type { Lead } from '@entities/lead';
import type { TagVariant, TagSize } from '@shared/ui/Tag';

interface Props {
    lead: Lead | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{ (e: 'close'): void }>();

const close = () => emit('close');

const statusVariant = computed<TagVariant>(() => {
    const s = props.lead?.status;
    if (s === 'won') return 'neon-green';
    if (s === 'lost') return 'neon-pink';
    if (s === 'negotiation' || s === 'proposal') return 'neon-yellow';
    return 'neon-blue';
});

const statusLabels: Record<string, string> = {
    new: 'Новый',
    contacted: 'Связались',
    qualified: 'Квалифицирован',
    proposal: 'КП отправлено',
    negotiation: 'Переговоры',
    won: 'Сделка закрыта',
    lost: 'Отказ',
};

const sourceLabels: Record<string, string> = {
    website: 'Сайт',
    referral: 'Рекомендация',
    cold_call: 'Холодный звонок',
    email: 'Email',
    social: 'Соцсети',
    event: 'Мероприятие',
    partner: 'Партнёр',
};

const sourceVariant = computed<TagVariant>(() => {
    const map: Record<string, TagVariant> = {
        website: 'neon-blue',
        referral: 'neon-green',
        cold_call: 'neon-pink',
        email: 'neon-yellow',
        social: 'neon-purple',
        event: 'neon-blue',
        partner: 'neon-green',
    };
    return map[props.lead?.source ?? ''] ?? 'default';
});

const formatAmount = (amount: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.lead-modal {
    position: fixed;
    inset: 0;
    z-index: $z-modal;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
}

.lead-modal__panel {
    position: relative;
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    padding: var(--card-padding);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);

    body:not(.dark-theme) & {
        background: #fff;
        border: 1px solid var(--border-color);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    body.dark-theme & {
        background: #1a1a24;
        border: 1px solid var(--glass-border);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
    }
}

.lead-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-md);
}

.lead-modal__name {
    font-size: var(--font-h3);
    font-weight: 600;
    margin: 0 0 4px;
    color: var(--text-main);
}

.lead-modal__position {
    font-size: var(--font-small);
    color: var(--text-secondary);
    margin: 0;
}

.lead-modal__close {
    @include focus-ring;
    @include flex(row, center, center);

    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    flex-shrink: 0;

    svg {
        width: 18px;
        height: 18px;
    }

    &:hover {
        color: var(--text-main);
        background: var(--glass-hover);
    }
}

.lead-modal__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-md);

    @include respond(tablet) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.lead-modal__field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.lead-modal__label {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.lead-modal__value {
    font-size: var(--font-small);
    color: var(--text-main);
    text-decoration: none;
}

.lead-modal__value--link {
    color: var(--neon-blue);

    &:hover {
        text-decoration: underline;
    }
}

.lead-modal__value--accent {
    color: var(--neon-green);
    font-weight: 600;
}

.lead-modal__notes {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-top: var(--gap-md);
    border-top: 1px solid var(--footer-border);
}

.lead-modal__notes-text {
    font-size: var(--font-small);
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>