<template>
    <div class="auth-page">
        <h1>Получить демо-токен</h1>
        <button @click="login" class="btn">Login</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@entities/user';

const router = useRouter();
const userStore = useUserStore();

const login = () => {
    userStore.setToken('demo-token'); //Тестовый токен
    userStore.setUser({ id: 1, email: 'demo@skilldev.ru', name: 'ТестовыйЮзер' });
    router.push('/dashboard');
};
</script>

<style scoped>
.auth-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
}

.auth-card {
    background: #f5f5f5;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
}
/* TODO (Style) Сделать общие стили для таких как btn */
.btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
