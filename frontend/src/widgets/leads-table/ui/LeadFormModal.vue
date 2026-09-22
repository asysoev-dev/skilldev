<template>
    <Modal
        :open="open"
        :title="isEdit ? 'Редактировать лида' : 'Новый лид'"
        :subtitle="isEdit ? lead?.email : 'Заполни поля и сохрани'"
        size="lg"
        @close="close"
    >
        <form class="lead-form" @submit="onSubmit">
            <div class="lead-form__grid">
                <Input
                    v-model="firstName"
                    label="Имя *"
                    placeholder="Имя"
                    :error="firstNameMeta.touched ? firstNameError : ''"
                    @blur="firstNameBlur"
                />
                <Input
                    v-model="lastName"
                    label="Фамилия *"
                    placeholder="Фамилия"
                    :error="lastNameMeta.touched ? lastNameError : ''"
                    @blur="lastNameBlur"
                />
                <Input
                    v-model="email"
                    type="email"
                    label="Email *"
                    placeholder="mail@example.com"
                    :error="emailMeta.touched ? emailError : ''"
                    @blur="emailBlur"
                />
                <PhoneInput
                    v-model="phone"
                    label="Телефон"
                    :error="phoneMeta.touched ? phoneError : ''"
                    @blur="phoneBlur"
                />
                <Input
                    v-model="company"
                    label="Компания *"
                    placeholder="Название компании"
                    :error="companyMeta.touched ? companyError : ''"
                    @blur="companyBlur"
                />
                <Input
                    v-model="position"
                    label="Должность *"
                    placeholder="Должность"
                    :error="positionMeta.touched ? positionError : ''"
                    @blur="positionBlur"
                />
                <Input
                    v-model="manager"
                    label="Менеджер *"
                    placeholder="Менеджер"
                    :error="managerMeta.touched ? managerError : ''"
                    @blur="managerBlur"
                />
                <Input
                    v-model.number="dealAmount"
                    type="number"
                    label="Сумма сделки, ₽"
                    placeholder="0"
                    :error="dealAmountMeta.touched ? dealAmountError : ''"
                    @blur="dealAmountBlur"
                />
                <Input
                    v-model="city"
                    label="Город *"
                    placeholder="Город"
                    :error="cityMeta.touched ? cityError : ''"
                    @blur="cityBlur"
                />
                <Input
                    v-model="industry"
                    label="Отрасль *"
                    placeholder="Отрасль"
                    :error="industryMeta.touched ? industryError : ''"
                    @blur="industryBlur"
                />
                <Select
                    v-model="source"
                    :options="SOURCE_OPTIONS"
                    label="Источник *"
                    :error="sourceMeta.touched ? sourceError : ''"
                    @blur="sourceBlur"
                />
                <Select
                    v-model="status"
                    :options="STATUS_OPTIONS"
                    label="Статус *"
                    :error="statusMeta.touched ? statusError : ''"
                    @blur="statusBlur"
                />
            </div>

            <Textarea
                v-model="notes"
                label="Заметки"
                placeholder="Комментарий"
                :rows="3"
                :error="notesMeta.touched ? notesError : ''"
                @blur="notesBlur"
            />

            <p v-if="submitError" class="lead-form__error">{{ submitError }}</p>

            <div class="lead-form__actions">
                <Button type="button" variant="outline" @click="close"> Отмена </Button>
                <Button type="submit" variant="primary" :loading="saving">
                    {{ isEdit ? 'Сохранить' : 'Создать' }}
                </Button>
            </div>
        </form>
    </Modal>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Modal, Input, Textarea, Select, Button, PhoneInput } from '@shared/ui';
import { useLeadStore } from '@entities/lead';
import type { Lead } from '@shared/api/leads.api';
import { SOURCE_OPTIONS, STATUS_OPTIONS } from '../model/lead-options';

interface Props {
    open: boolean;
    lead?: Lead | null;
}

const props = withDefaults(defineProps<Props>(), {
    lead: null,
});

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'saved'): void;
}>();

const store = useLeadStore();

const isEdit = computed(() => !!props.lead);
const saving = ref(false);
const submitError = ref('');

const NAME_REGEX = /^[А-Яа-яЁёA-Za-z\s-]+$/;

const schema = toTypedSchema(
    z.object({
        firstName: z
            .string()
            .min(2, { message: 'Минимум 2 символа' })
            .max(50, { message: 'Максимум 50 символов' })
            .regex(NAME_REGEX, { message: 'Только буквы, пробел и дефис' }),
        lastName: z
            .string()
            .min(2, { message: 'Минимум 2 символа' })
            .max(50, { message: 'Максимум 50 символов' })
            .regex(NAME_REGEX, { message: 'Только буквы, пробел и дефис' }),
        email: z.string().email({ message: 'Неверный формат email' }),
        phone: z
            .string()
            .optional()
            .or(z.literal(''))
            .refine((val) => !val || /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(val), {
                message: 'Формат: +7 (XXX) XXX-XX-XX',
            }),
        company: z.string().min(1, { message: 'Обязательное поле' }),
        position: z.string().min(1, { message: 'Обязательное поле' }),
        manager: z.string().min(1, { message: 'Обязательное поле' }),
        dealAmount: z.coerce.number().min(0, { message: 'Не может быть отрицательным' }).optional(),
        city: z.string().min(1, { message: 'Обязательное поле' }),
        industry: z.string().min(1, { message: 'Обязательное поле' }),
        source: z.enum(['website', 'referral', 'cold_call', 'email', 'social', 'event', 'partner']),
        status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']),
        notes: z.string().optional().or(z.literal('')),
    })
);

const emptyValues = () => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    manager: '',
    dealAmount: 0,
    city: '',
    industry: '',
    source: 'website' as const,
    status: 'new' as const,
    notes: '',
});

const { handleSubmit, errors, setValues, resetForm } = useForm({
    validationSchema: schema,
    initialValues: emptyValues(),
    keepValuesOnUnmount: false,
});

const {
    value: firstName,
    errorMessage: firstNameError,
    meta: firstNameMeta,
    handleBlur: firstNameBlur,
} = useField<string>('firstName');
const {
    value: lastName,
    errorMessage: lastNameError,
    meta: lastNameMeta,
    handleBlur: lastNameBlur,
} = useField<string>('lastName');
const {
    value: email,
    errorMessage: emailError,
    meta: emailMeta,
    handleBlur: emailBlur,
} = useField<string>('email');
const {
    value: phone,
    errorMessage: phoneError,
    meta: phoneMeta,
    handleBlur: phoneBlur,
} = useField<string>('phone');
const {
    value: company,
    errorMessage: companyError,
    meta: companyMeta,
    handleBlur: companyBlur,
} = useField<string>('company');
const {
    value: position,
    errorMessage: positionError,
    meta: positionMeta,
    handleBlur: positionBlur,
} = useField<string>('position');
const {
    value: manager,
    errorMessage: managerError,
    meta: managerMeta,
    handleBlur: managerBlur,
} = useField<string>('manager');
const {
    value: dealAmount,
    errorMessage: dealAmountError,
    meta: dealAmountMeta,
    handleBlur: dealAmountBlur,
} = useField<number>('dealAmount');
const {
    value: city,
    errorMessage: cityError,
    meta: cityMeta,
    handleBlur: cityBlur,
} = useField<string>('city');
const {
    value: industry,
    errorMessage: industryError,
    meta: industryMeta,
    handleBlur: industryBlur,
} = useField<string>('industry');
const {
    value: source,
    errorMessage: sourceError,
    meta: sourceMeta,
    handleBlur: sourceBlur,
} = useField<string>('source');
const {
    value: status,
    errorMessage: statusError,
    meta: statusMeta,
    handleBlur: statusBlur,
} = useField<string>('status');
const {
    value: notes,
    errorMessage: notesError,
    meta: notesMeta,
    handleBlur: notesBlur,
} = useField<string>('notes');

watch(
    () => props.open,
    async (open) => {
        if (!open) return;

        submitError.value = '';
        await nextTick();

        if (props.lead) {
            resetForm({
                values: {
                    ...props.lead,
                    phone: props.lead.phone ?? '',
                    notes: props.lead.notes ?? '',
                },
            });
        } else {
            resetForm({ values: emptyValues() });
        }
    }
);

const close = () => {
    if (saving.value) return;
    emit('close');
};

const onSubmit = handleSubmit(async (values) => {
    saving.value = true;
    submitError.value = '';

    try {
        const payload = {
            ...values,
            phone: values.phone || undefined,
            notes: values.notes || undefined,
            dealAmount: values.dealAmount ?? 0,
        };

        if (isEdit.value && props.lead) {
            await store.updateLead(props.lead.id, payload);
        } else {
            await store.createLead(payload);
        }

        emit('saved');
        emit('close');
    } catch (e) {
        submitError.value = 'Не удалось сохранить. Проверь поля.';
        console.error(e);
    } finally {
        saving.value = false;
    }
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.lead-form {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.lead-form__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-md);

    @include respond(tablet) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.lead-form__error {
    padding: 10px 14px;
    border-radius: var(--radius-md);
    background: rgba(255, 59, 92, 0.1);
    border: 1px solid rgba(255, 59, 92, 0.3);
    font-size: var(--font-small);
    color: var(--neon-pink);
    margin: 0;
}

.lead-form__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--gap-sm);
    padding-top: var(--gap-md);
    border-top: 1px solid var(--footer-border);
}
</style>
