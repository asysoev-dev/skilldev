<template>
    <Modal :open="open" title="Frontend" subtitle="Vue 3, TypeScript, SCSS" size="md" @close="$emit('close')">
        <div class="demo">
            <p class="demo__text">
                Интерфейс на Vue 3 с Composition API и TypeScript. Состояние в Pinia,
                стили в SCSS с CSS-переменными под темы. Сборка на Webpack, архитектура FSD:
                <code>app</code>, <code>pages</code>, <code>features</code>,
                <code>entities</code>, <code>widgets</code>, <code>shared</code>.
            </p>

            <RouterLink to="/demo/ui" custom v-slot="{ navigate }">
                <Button
                    variant="secondary"
                    :icon-right="ArrowRightIcon"
                    @click="navigate(); $emit('close')"
                >
                    Посмотреть UI-кит
                </Button>
            </RouterLink>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
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

    code {
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--neon-blue);
    }
}

.demo__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    align-items: center;
}
</style>