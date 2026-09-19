import { defineStore } from 'pinia';
import { analyticsApi, type ChartData, type TimelineData } from '@shared/api/analytics.api';

interface State {
    timeline: TimelineData | null;
    sources: ChartData | null;
    funnel: ChartData | null;
    managers: ChartData | null;
    loading: boolean;
    error: string | null;
}

export const useAnalyticsStore = defineStore('analytics', {
    state: (): State => ({
        timeline: null,
        sources: null,
        funnel: null,
        managers: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchAll() {
            this.loading = true;
            this.error = null;
            try {
                const [timeline, sources, funnel, managers] = await Promise.all([
                    analyticsApi.getTimeline(),
                    analyticsApi.getSources(),
                    analyticsApi.getFunnel(),
                    analyticsApi.getManagers(),
                ]);
                this.timeline = timeline.data;
                this.sources = sources.data;
                this.funnel = funnel.data;
                this.managers = managers.data;
            } catch (e) {
                this.error = 'Не удалось загрузить аналитику';
                console.error(e);
            } finally {
                this.loading = false;
            }
        },
    },
});
