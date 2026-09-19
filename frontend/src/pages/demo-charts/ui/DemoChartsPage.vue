<template>
    <div class="demo-charts">
        <BackToStands />
        <header class="demo-charts__header">
            <h1 class="demo-charts__title">Charts</h1>
            <p class="demo-charts__subtitle">
                Аналитика по лидам: динамика, источники, воронка, конверсия.
            </p>
        </header>

        <div v-if="store.loading" class="demo-charts__loading">Загрузка графиков…</div>

        <div v-else-if="store.error" class="demo-charts__error">{{ store.error }}</div>

        <div v-else class="demo-charts__grid">
            <TimelineChart
                v-if="store.timeline"
                :data="store.timeline"
                class="demo-charts__item--wide"
            />
            <SourcesChart v-if="store.sources" :data="store.sources" />
            <FunnelChart v-if="store.funnel" :data="store.funnel" />
            <ManagersChart v-if="store.managers" :data="store.managers" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAnalyticsStore } from '@entities/lead';
import { TimelineChart, SourcesChart, FunnelChart, ManagersChart } from '@widgets/lead-charts';
import { BackToStands } from '@shared/ui';

const store = useAnalyticsStore();

onMounted(() => {
    store.fetchAll();
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.demo-charts {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    padding: var(--section-spacing) 0;
}

.demo-charts__header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
}

.demo-charts__title {
    font-size: var(--font-h1);
    font-weight: 600;
    margin: 0;
}

.demo-charts__subtitle {
    font-size: var(--font-body);
    color: var(--text-secondary);
    margin: 0;
}

.demo-charts__notice {
    padding: 10px 16px;
    border-radius: var(--radius-md);
    background: rgba(255, 215, 0, 0.08);
    border: 1px solid rgba(255, 215, 0, 0.2);
    font-size: var(--font-small);
    color: var(--text-secondary);
}

.demo-charts__loading,
.demo-charts__error {
    padding: var(--section-spacing) 0;
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--font-small);
}

.demo-charts__error {
    color: var(--neon-pink);
}

.demo-charts__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-md);

    @include respond(tablet) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.demo-charts__item--wide {
    @include respond(tablet) {
        grid-column: 1 / -1;
    }
}
</style>
