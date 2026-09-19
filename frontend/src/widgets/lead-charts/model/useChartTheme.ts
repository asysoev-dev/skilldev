import { computed, onMounted, onUnmounted } from 'vue';
import { useTheme } from '@shared/lib/useTheme';

const chartColors = {
    light: {
        text: '#18181b',
        textSecondary: '#6b7280',
        grid: 'rgba(0, 0, 0, 0.06)',
        blue: '#00d4ff',
        blueAlpha: 'rgba(0, 212, 255, 0.15)',
        green: '#4ade80',
        greenAlpha: 'rgba(74, 222, 128, 0.15)',
        pink: '#e05780',
        yellow: '#e0b64a',
        purple: '#9b6dd6',
    },
    dark: {
        text: '#ffffff',
        textSecondary: '#888899',
        grid: 'rgba(255, 255, 255, 0.06)',
        blue: '#00d4ff',
        blueAlpha: 'rgba(0, 212, 255, 0.2)',
        green: '#4ade80',
        greenAlpha: 'rgba(74, 222, 128, 0.2)',
        pink: '#e05780',
        yellow: '#e0b64a',
        purple: '#9b6dd6',
    },
};

export function useChartTheme() {
    const { isDark } = useTheme();
    const colors = computed(() => (isDark.value ? chartColors.dark : chartColors.light));
    return { colors };
}
