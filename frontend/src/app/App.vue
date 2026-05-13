<template>
    <div id="app">
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

<script setup lang="ts">
</script>

<style scoped>
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
