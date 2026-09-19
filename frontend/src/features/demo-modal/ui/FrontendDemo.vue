<template>
    <Modal :open="open" title="Frontend" subtitle="Vue 3, TypeScript, анимации" size="md" @close="$emit('close')">
        <div class="demo">
            <p class="demo__text">
                Стек: <strong>Vue 3</strong>, <strong>TypeScript</strong>, <strong>SCSS</strong>,
                <strong>Pinia</strong>, <strong>Composition API</strong>.
            </p>

            <div class="demo__row">
                <Button variant="primary">Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="primary-action">Save</Button>
            </div>

            <div class="demo__row">
                <Input v-model="name" label="Инпут" placeholder="Введите текст..." />
            </div>

            <div class="demo__row">
                <Switch v-model="on" label="Свитч" />
                <Tag variant="neon-blue">Vue 3</Tag>
                <Tag variant="neon-green">TypeScript</Tag>
            </div>

            <p class="demo__hint">Всё работает вживую. Кликай, вводи текст, переключай.</p>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Modal, Button, Input, Switch, Tag } from '@shared/ui';

interface Props {
    open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{ (e: 'close'): void }>();

const name = ref('');
const on = ref(false);
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.demo {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.demo__text {
    font-size: var(--font-small);
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
}

.demo__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    align-items: center;
}

.demo__hint {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
    margin: 0;
    text-align: center;
}
</style>