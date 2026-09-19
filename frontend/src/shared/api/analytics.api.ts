import { apiClient } from './client';

export interface ChartData {
    labels: string[];
    values: number[];
}

export interface TimelineData {
    labels: string[];
    created: number[];
    closed: number[];
}

export const analyticsApi = {
    getTimeline: () => apiClient.get<TimelineData>('/analytics/timeline'),
    getSources: () => apiClient.get<ChartData>('/analytics/sources'),
    getFunnel: () => apiClient.get<ChartData>('/analytics/funnel'),
    getManagers: () => apiClient.get<ChartData>('/analytics/managers'),
};
