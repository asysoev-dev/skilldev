<template>
    <Modal :open="open" title="UI-кит" subtitle="Компоненты" size="md" @close="$emit('close')">
        <div class="demo">
            <p class="demo__text">
                Кнопки, инпуты, чекбоксы, свитчи, карточки, теги — всё используется в этом проекте.
            </p>

            <div class="demo__row">
                <Tag variant="neon-blue">Vue 3</Tag>
                <Tag variant="neon-green">TypeScript</Tag>
                <Tag variant="neon-pink">SCSS</Tag>
                <Tag variant="neon-yellow">Pinia</Tag>
            </div>

            <p class="demo__hint">Полная витрина со всеми состояниями — на странице /demo/ui.</p>

            <RouterLink to="/demo/ui" custom v-slot="{ navigate }">
                <Button
                    variant="secondary"
                    :icon-right="ArrowRightIcon"
                    @click="
                        navigate();
                        $emit('close');
                    "
                >
                    Открыть витрину
                </Button>
            </RouterLink>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { Modal, Tag, Button } from '@shared/ui';

interface Props {
    open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{ (e: 'close'): void }>();
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
}

.demo__hint {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
    margin: 0;
    text-align: center;
}
</style>
