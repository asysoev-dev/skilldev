<template>
    <Toast
        :visible="!!current"
        :text="current?.text ?? ''"
        :type="(current?.type as any) ?? 'info'"
        @close="dismiss"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Toast } from '@shared/ui';
import { useWebSocket } from '@shared/lib/useWebSocket';

const { notifications, dismissNotification } = useWebSocket();

const current = computed(() => notifications.value[0] ?? null);

const dismiss = () => {
    if (current.value) {
        dismissNotification(current.value.timestamp);
    }
};
</script>
