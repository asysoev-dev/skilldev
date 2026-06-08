<template>
    <div class="dashboard-page">
        <h1>Dashboard</h1>
        <p>Welcome, {{ userStore.user?.name || userStore.user?.email }}!</p>

        <button @click="authApi.getMe">GetMe</button>
        <button @click="logout">LogOut</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/entities/user';
import { useAuth } from '@/features/auth/model/useAuth';
import { authApi } from '@shared/api/auth.api';

const userStore = useUserStore();
const { logout, checkAuth } = useAuth();

onMounted(async () => {
    await checkAuth();
});
</script>

<style scoped>
.dashboard-page {
    text-align: center;
}
</style>
