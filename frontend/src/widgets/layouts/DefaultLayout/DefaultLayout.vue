<template>
    <div class="container">
        <header class="app-header">
            <h1>SkillDev Portfolio</h1>
            <nav>
                <router-link to="/">Главная</router-link>
                <router-link to="/auth">Авторизация</router-link>
                <router-link to="/dashboard">Dashboard</router-link>
            </nav>
        </header>

        <main>
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts"></script>
<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.app-header {
    @include flex(row, space-between, center);
    padding: 1rem 2rem;
}

nav {
    display: flex;
    gap: 1rem;
}

nav a {
    text-decoration: none;
}

nav a:hover {
    text-decoration: underline;
}

main {
    padding: 2rem;
}
</style>