<template>
    <div class="home-page">
        <Hero />
        <SkillGrid />

        <TourBanner :steps="tourSteps" />
        <TourOverlay />
        <MobileNotice />
    </div>
</template>

<script setup lang="ts">
import { Hero } from '@widgets/hero';
import { SkillGrid } from '@widgets/skill-grid';
import { TourBanner, TourOverlay, MobileNotice } from '@widgets/tour';
import { useSettingsPopover } from '@shared/lib/useSettingsPopover';
import type { TourStep } from '@shared/lib/useTour';

const settings = useSettingsPopover();

const tourSteps: TourStep[] = [
    {
        id: 'hero-title',
        target: '.tour__step-first',
        title: 'Это заголовок',
        text: 'Написал просто для теста)',
        position: 'bottom',
    },
    {
        id: 'hero-photo',
        target: '.tour__step-second',
        title: 'Это мое фото',
        text: 'Оно черно-белое. ТЕСТ',
        position: 'left',
    },
    {
        id: 'settings_theme',
        target: '.tour__step-third',
        fallbackTarget: '.header__settings',
        title: 'Темы',
        text: 'Есть два варианта темы: светлая и темная (космос).',
        position: 'left',
        before: () => settings.open(),
        after: () => settings.close(),
        offsetY: 100,
        offsetX: -200,
        waitFor: 500,
    },
    {
        id: 'settings_parallax',
        target: '.tour__step-fourth',
        fallbackTarget: '.header__settings',
        title: 'Параллакс',
        text: 'Вкючить/выключить параллакс. Работает только на темной теме',
        position: 'left',
        before: () => settings.open(),
        after: () => settings.close(),
        offsetY: 100,
        offsetX: -200,
        waitFor: 500,
    },
    {
        id: 'skill-grid',
        target: '.tour__step-fifth',
        fallbackTarget: '.header__settings',
        title: 'Языки (RU/EN)',
        text: 'На данный момент переводит только интерфейс.',
        position: 'left',
        before: () => settings.open(),
        after: () => settings.close(),
        offsetY: 100,
        offsetX: -200,
        waitFor: 500,
    },
    {
        id: 'skill-grid',
        target: '.tour__step-sixth',
        title: 'Демо-стенды',
        text: '8 стендов с живыми демо: SSR, WebSocket, Charts, Data Table.',
        position: 'top',
        offsetY: 220,
    },
];
</script>