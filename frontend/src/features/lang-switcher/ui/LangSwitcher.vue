<template>
    <button
        type="button"
        class="lang-switcher"
        :aria-label="`Switch to ${lang === 'ru' ? 'English' : 'Russian'}`"
        @click="toggleLang"
    >
        <span
            class="lang-switcher__item"
            :class="{ 'lang-switcher__item--active': lang === 'ru' }"
        >RU</span>
        <span
            class="lang-switcher__item"
            :class="{ 'lang-switcher__item--active': lang === 'en' }"
        >EN</span>
    </button>
</template>

<script setup lang="ts">
import { useI18n } from '@shared/lib/useI18n';

const { lang, toggleLang } = useI18n();
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.lang-switcher {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 4px;
    border-radius: var(--radius-full);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: var(--glass-border);
    cursor: pointer;
    user-select: none;
    font-family: inherit;
    transition: background var(--transition-base);

    @include focus-ring;

    &:hover {
        background: var(--glass-hover);
    }
}

.lang-switcher__item {
    padding: 6px 10px;
    border-radius: var(--radius-full);
    font-size: var(--font-tiny);
    font-weight: 600;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
    transition: all var(--transition-base);
}

.lang-switcher__item--active {
    background: var(--neon-blue);
    color: #08080c;
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.4);
}
</style>
