<template>
    <Modal :open="open" title="SSR" subtitle="Server-Side Rendering без Nuxt" size="lg" @close="$emit('close')">
        <div class="demo">
            <p class="demo__text">
                Собственный <strong>SSR</strong> на <strong>Express</strong> + <strong>Vue</strong>.
                Главная <strong>/</strong> рендерится на сервере, остальные страницы — SPA.
            </p>

            <div class="demo__scheme">
                <div class="demo__row">
                    <div class="demo__node demo__node--browser">Browser</div>
                    <span class="demo__arrow">→</span>
                    <div class="demo__node demo__node--nginx">Nginx</div>
                </div>

                <div class="demo__arrow-down">↓</div>

                <div class="demo__row">
                    <div class="demo__node demo__node--ssr">
                        <span>SSR /</span>
                        <span class="demo__node-sub">renderToString</span>
                    </div>
                    <div class="demo__node demo__node--spa">
                        <span>SPA /demo/*</span>
                        <span class="demo__node-sub">client-side</span>
                    </div>
                </div>
            </div>

            <div class="demo__stats">
                <div class="demo__stat">
                    <span class="demo__stat-value">~120ms</span>
                    <span class="demo__stat-label">TTFB главной</span>
                </div>
                <div class="demo__stat">
                    <span class="demo__stat-value">90+</span>
                    <span class="demo__stat-label">Lighthouse SEO</span>
                </div>
                <div class="demo__stat">
                    <span class="demo__stat-value">0</span>
                    <span class="demo__stat-label">Hydration mismatch</span>
                </div>
            </div>

            <p class="demo__hint">
                Открой DevTools → Network → отключи JS → обнови / → увидишь серверный HTML.
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

.demo__row {
    @include flex(row, center, center);

    gap: var(--gap-sm);
    flex-wrap: wrap;
}

.demo__node {
    @include flex(column, center, center);

    padding: 10px 16px;
    border-radius: var(--radius-md);
    background: rgba(0, 212, 255, 0.08);
    border: 1px solid rgba(0, 212, 255, 0.3);
    font-size: var(--font-small);
    font-weight: 600;
    color: var(--text-main);
    gap: 2px;
}

.demo__node-sub {
    font-size: var(--font-tiny);
    font-weight: 400;
    color: var(--text-tertiary);
}

.demo__node--browser {
    background: rgba(138, 43, 226, 0.1);
    border-color: rgba(138, 43, 226, 0.35);
}

.demo__node--nginx {
    background: rgba(224, 87, 128, 0.1);
    border-color: rgba(224, 87, 128, 0.35);
}

.demo__node--ssr {
    background: rgba(74, 222, 128, 0.1);
    border-color: rgba(74, 222, 128, 0.35);
}

.demo__node--spa {
    background: rgba(224, 182, 74, 0.1);
    border-color: rgba(224, 182, 74, 0.35);
}

.demo__arrow {
    font-size: 20px;
    color: var(--text-tertiary);
}

.demo__arrow-down {
    font-size: 20px;
    color: var(--text-tertiary);
}

.demo__stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-sm);

    @include respond(tablet) {
        grid-template-columns: repeat(3, 1fr);
    }
}

.demo__stat {
    @include flex(column, center, center);

    padding: var(--gap-md);
    border-radius: var(--radius-md);
    background: var(--glass-bg);
    border: 1px solid var(--border-color);
    gap: 4px;
}

.demo__stat-value {
    font-size: var(--font-h3);
    font-weight: 600;
    color: var(--neon-blue);
}

.demo__stat-label {
    font-size: var(--font-tiny);
    color: var(--text-secondary);
    text-align: center;
}

.demo__hint {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
    margin: 0;
    text-align: center;
}
</style>