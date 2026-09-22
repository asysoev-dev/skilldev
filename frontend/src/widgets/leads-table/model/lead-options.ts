import type { SelectOption } from '@shared/ui/Select/Select.types';

export const SOURCE_OPTIONS: SelectOption[] = [
    { value: 'website', label: 'Сайт' },
    { value: 'referral', label: 'Рекомендация' },
    { value: 'cold_call', label: 'Холодный звонок' },
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Соцсети' },
    { value: 'event', label: 'Мероприятие' },
    { value: 'partner', label: 'Партнёр' },
];

export const STATUS_OPTIONS: SelectOption[] = [
    { value: 'new', label: 'Новый' },
    { value: 'contacted', label: 'Связались' },
    { value: 'qualified', label: 'Квалифицирован' },
    { value: 'proposal', label: 'КП отправлено' },
    { value: 'negotiation', label: 'Переговоры' },
    { value: 'won', label: 'Сделка закрыта' },
    { value: 'lost', label: 'Отказ' },
];