<template>
    <div class="chart-card">
        <h3 class="chart-card__title">Источники</h3>
        <p class="chart-card__subtitle">Откуда приходят лиды</p>
        <div class="chart-card__canvas">
            <Doughnut :data="data" :options="options" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData } from '@shared/api/analytics.api';
import { useChartTheme } from '../model/useChartTheme';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    data: ChartData;
}

const props = defineProps<Props>();
const { colors } = useChartTheme();

const sourceLabels: Record<string, string> = {
    website: 'Сайт',
    referral: 'Рекомендация',
    cold_call: 'Холодный звонок',
    email: 'Email',
    social: 'Соцсети',
    event: 'Мероприятие',
    partner: 'Партнёр',
};

const data = computed(() => ({
    labels: props.data.labels.map((l) => sourceLabels[l] ?? l),
    datasets: [
        {
            data: props.data.values,
            backgroundColor: [
                colors.value.blue,
                colors.value.green,
                colors.value.pink,
                colors.value.yellow,
                colors.value.purple,
                '#4ea8de',
                '#4ade80',
            ],
            borderWidth: 0,
        },
    ],
}));

const options = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                color: colors.value.text,
                padding: 12,
                font: { size: 12 },
            },
        },
    },
}));
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.chart-card {
    @include glass;
    padding: var(--card-padding);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.chart-card__title {
    font-size: var(--font-h3);
    font-weight: 600;
    margin: 0;
}

.chart-card__subtitle {
    font-size: var(--font-small);
    color: var(--text-secondary);
    margin: 0 0 var(--gap-md);
}

.chart-card__canvas {
    position: relative;
    height: 280px;
    width: 100%;
}

.chart-card__canvas canvas {
    width: 100% !important;
    height: 100% !important;
}
</style>
