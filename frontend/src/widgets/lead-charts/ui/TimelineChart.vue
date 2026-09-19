<template>
    <div class="chart-card">
        <h3 class="chart-card__title">Динамика лидов</h3>
        <p class="chart-card__subtitle">За последние 12 месяцев</p>
        <div class="chart-card__canvas">
            <Line :data="data" :options="options" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import type { TimelineData } from '@shared/api/analytics.api';
import { useChartTheme } from '../model/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
    data: TimelineData;
}

const props = defineProps<Props>();
const { colors } = useChartTheme();

const data = computed(() => ({
    labels: props.data.labels.map((l) => {
        const [year, month] = l.split('-');
        const months = [
            'янв',
            'фев',
            'мар',
            'апр',
            'май',
            'июн',
            'июл',
            'авг',
            'сен',
            'окт',
            'ноя',
            'дек',
        ];
        return `${months[parseInt(month, 10) - 1]} ${year.slice(2)}`;
    }),
    datasets: [
        {
            label: 'Создано',
            data: props.data.created,
            borderColor: colors.value.blue,
            backgroundColor: colors.value.blueAlpha,
            fill: true,
            tension: 0.4,
        },
        {
            label: 'Закрыто',
            data: props.data.closed,
            borderColor: colors.value.green,
            backgroundColor: colors.value.greenAlpha,
            fill: true,
            tension: 0.4,
        },
    ],
}));

const options = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: colors.value.text },
        },
    },
    scales: {
        x: {
            ticks: { color: colors.value.textSecondary },
            grid: { color: colors.value.grid },
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
