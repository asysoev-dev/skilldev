<template>
    <div class="app-layout">
        <ParallaxLayer />

        <Header />

        <main class="app-layout__main">
            <div class="container">
                <RouterView />
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ParallaxLayer } from '@widgets/parallax-layer';
import { Header } from '@widgets/header';
import { Footer } from '@widgets/footer';
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;

.app-layout {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-layout__main {
    position: relative;
    z-index: $z-content;
    flex: 1;
    padding-bottom: var(--section-spacing);
}
</style>
