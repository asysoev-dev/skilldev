<template>
    <section class="hero">
        <div class="hero__content">
            <h1 class="hero__title">
                <span class="hero__title-accent">Frontend</span><span class="hero__title-dash">-</span>разработчик
            </h1>

            <p class="hero__subtitle">
                Привет! Меня зовут Алексей. <br>
                5+ лет опыта в коммерческой разработке. Пишу на Vue 3 и
                TypeScript, бэкенд — на Node.js. Работал над B2B-системами, IoT и e-commerce.
            </p>

            <div class="hero__badges">
                <Tag size="sm">Vue 3</Tag>
                <Tag size="sm">TypeScript</Tag>
                <Tag size="sm">Node.js</Tag>
                <Tag size="sm">JWT</Tag>
                <Tag size="sm">SSR</Tag>
                <Tag size="sm">WebSocket</Tag>
                <Tag size="sm">Docker</Tag>
                <Tag size="sm"> CI/CD</Tag>
            </div>

            <div class="hero__actions">
                <Button variant="primary" size="lg" @click="onTour">Тур по сайту</Button>
                <Button variant="outline-primary-action" size="lg" @click="onDemo">Демо</Button>
                <Button variant="outline" size="lg" :icon-left="CodeBracketIcon" @click="onGithub">
                    GitHub
                </Button>
            </div>
        </div>

        <div class="hero__photo-wrapper">
            <img
                src="/myfoto.jpg"
                alt="Алексей Сысоев"
                class="hero__photo"
                width="350"
                height="350"
                decoding="async"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import { CodeBracketIcon } from '@heroicons/vue/24/outline';
import { Button, Tag } from '@shared/ui';

const onTour = () => console.log('Tour clicked');
const onDemo = () => (window.location.href = '/demo');
const onGithub = () =>
    window.open('https://github.com/asysoev-dev/skilldev', '_blank', 'noopener noreferrer');
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.hero {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-lg);
    padding: 40px 0 60px;

    @include respond(tablet) {
        padding: 60px 0 80px;
    }

    @include respond(desktop) {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--gap-xl);
        padding: 80px 0 100px;
    }
}

.hero__content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
    max-width: 640px;
    z-index: 2;

    @include respond(desktop) {
        padding-top: 40px;
    }
}

.hero__title {
    font-size: var(--font-h1);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.02em;
}

.hero__title-accent {
    background: linear-gradient(135deg, var(--neon-blue), var(--neon-pink));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero__title-dash {
    margin: 0 3px;
}

.hero__subtitle {
    font-size: 18px;
    color: var(--text-secondary);
    line-height: 1.5;
    max-width: 480px;
    margin: 0;
}

.hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    margin-top: var(--gap-sm);

    @include respond-down(tablet) {
        flex-direction: column;
        align-items: stretch;

        :deep(.button) {
            width: 100%;
        }
    }
}

.hero__badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    margin-top: var(--gap-sm);
}

.hero__photo-wrapper {
    position: relative;
    align-self: center;
    flex-shrink: 0;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid var(--glass-border);
    box-shadow: 0 0 60px rgba(0, 0, 0, 0.2);
    order: -1;

    @include respond(tablet) {
        width: 280px;
        height: 280px;
    }

    @include respond(desktop) {
        width: 350px;
        height: 350px;
        align-self: flex-start;
        order: 0;
    }
}

.hero__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(1.1) brightness(0.95);
    transition: filter 0.5s ease;

    // &:hover {
    //     filter: grayscale(0%) contrast(1) brightness(1);
    // }
}
</style>
