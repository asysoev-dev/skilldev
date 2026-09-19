<template>
    <div class="chart-card">
        <h3 class="chart-card__title">Воронка продаж</h3>
        <p class="chart-card__subtitle">Распределение по статусам</p>
        <div class="chart-card__canvas">
            <Bar :data="data" :options="options" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import type { ChartData } from '@shared/api/analytics.api';
import { useChartTheme } from '../model/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
    data: ChartData;
}

const props = defineProps<Props>();
const { colors } = useChartTheme();

const statusLabels: Record<string, string> = {
    new: 'Новые',
    contacted: 'Связались',
    qualified: 'Квалиф.',
    proposal: 'КП',
    negotiation: 'Переговоры',
    won: 'Победа',
    lost: 'Отказ',
};

const data = computed(() => ({
    labels: props.data.labels.map((l) => statusLabels[l] ?? l),
    datasets: [
        {
            label: 'Лидов',
            data: props.data.values,
            backgroundColor: [
                colors.value.blue,
                colors.value.blue,
                colors.value.blue,
                colors.value.yellow,
                colors.value.yellow,
                colors.value.green,
                colors.value.pink,
            ],
            borderRadius: 6,
        },
    ],
}));

const options = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        x: {
            ticks: { color: colors.value.textSecondary },
            grid: { display: false },
        },
        y: {
            ticks: { color: colors.value.textSecondary },
            grid: { color: colors.value.grid },
            beginAtZero: true,
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