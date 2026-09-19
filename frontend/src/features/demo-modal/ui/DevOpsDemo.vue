<template>
    <Modal :open="open" title="DevOps" subtitle="Docker, Nginx, CI/CD" size="lg" @close="$emit('close')">
        <div class="demo">
            <p class="demo__text">
                4 контейнера в проде. CI/CD через GitHub Actions.
                HTTPS через Let's Encrypt.
            </p>

            <div class="demo__scheme">
                <div class="demo__node demo__node--entry">
                    <span class="demo__node-title">Nginx</span>
                    <span class="demo__node-sub">443 · HTTPS</span>
                </div>

                <div class="demo__arrows">
                    <span>↓</span>
                    <span>↓</span>
                </div>

                <div class="demo__branch">
                    <div class="demo__node">
                        <span class="demo__node-title">frontend-ssr</span>
                        <span class="demo__node-sub">:3000 · Node.js</span>
                    </div>
                    <div class="demo__node">
                        <span class="demo__node-title">backend</span>
                        <span class="demo__node-sub">:3001 · Express</span>
                    </div>
                </div>

                <div class="demo__arrows">
                    <span>↓</span>
                </div>

                <div class="demo__node demo__node--db">
                    <span class="demo__node-title">postgres</span>
                    <span class="demo__node-sub">:5432 · PostgreSQL 16</span>
                </div>
            </div>

            <p class="demo__hint">
                Каждый пуш в main → сборка → деплой на VPS за 2-3 минуты.
            </p>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { Modal } from '@shared/ui';

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

.demo__scheme {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-md);
    border-radius: var(--radius-md);
    background: var(--glass-bg);
    border: 1px solid var(--border-color);
}

.demo__node {
    @include flex(column, center, center);

    padding: 10px 16px;
    border-radius: var(--radius-md);
    background: rgba(0, 212, 255, 0.08);
    border: 1px solid rgba(0, 212, 255, 0.3);
    min-width: 160px;
    gap: 2px;
}

.demo__node--entry {
    background: rgba(138, 43, 226, 0.1);
    border-color: rgba(138, 43, 226, 0.35);
}

.demo__node--db {
    background: rgba(74, 222, 128, 0.1);
    border-color: rgba(74, 222, 128, 0.35);
}

.demo__node-title {
    font-size: var(--font-small);
    font-weight: 600;
    color: var(--text-main);
}

.demo__node-sub {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
}

.demo__arrows {
    display: flex;
    gap: 60px;
    color: var(--text-tertiary);
    font-size: 18px;
}

.demo__branch {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);

    @include respond(tablet) {
        flex-direction: row;
    }
}

.demo__hint {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
    margin: 0;
    text-align: center;
}
</style>