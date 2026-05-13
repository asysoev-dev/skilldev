<template>
    <div class="dashboard-page">
        <h1>Dashboard</h1>
        <p>Welcome, {{ userName }}!</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@entities/user';

const userStore = useUserStore();
const userName = computed(() => userStore.user?.name || 'User');
</script>

<style scoped>
.dashboard-page {
    text-align: center;
}
</style>
