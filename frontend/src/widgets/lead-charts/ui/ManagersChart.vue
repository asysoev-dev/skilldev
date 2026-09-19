<template>
    <div class="chart-card">
        <h3 class="chart-card__title">Конверсия менеджеров</h3>
        <p class="chart-card__subtitle">% закрытых сделок</p>
        <div class="chart-card__canvas">
            <Radar :data="data" :options="options" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Radar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import type { ChartData } from '@shared/api/analytics.api';
import { useChartTheme } from '../model/useChartTheme';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
    data: ChartData;
}

const props = defineProps<Props>();
const { colors } = useChartTheme();

const data = computed(() => ({
    labels: props.data.labels.map((full) => {
        const [first, last] = full.split(' ');
        return last ? `${first} ${last[0]}.` : first;
    }),
    datasets: [
        {
            label: 'Конверсия, %',
            data: props.data.values,
            borderColor: colors.value.blue,
            backgroundColor: colors.value.blueAlpha,
            pointBackgroundColor: colors.value.blue,
            borderWidth: 2,
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
        r: {
            angleLines: { color: colors.value.grid },
            grid: { color: colors.value.grid },
            pointLabels: { color: colors.value.textSecondary, font: { size: 12 } },
            ticks: {
                color: colors.value.textSecondary,
                backdropColor: 'transparent',
                stepSize: 25,
            },
            suggestedMin: 0,
            suggestedMax: 100,
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
