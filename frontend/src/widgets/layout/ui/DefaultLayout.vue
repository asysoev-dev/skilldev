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

        <ToastContainer />
        <ConfirmDialog />
        <TourBanner />
        <TourOverlay />
        <MobileNotice />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from '@features/auth/model/useAuth';
import { RouterView } from 'vue-router';
import { ParallaxLayer } from '@widgets/parallax-layer';
import { Header } from '@widgets/header';
import { Footer } from '@widgets/footer';
import { ToastContainer } from '@widgets/toast-container';
import { ConfirmDialog } from '@shared/ui';
import { TourBanner, TourOverlay, MobileNotice } from '@widgets/tour';
import { useWebSocket } from '@shared/lib/useWebSocket';

const { checkAuth } = useAuth();

useWebSocket();

onMounted(async () => {
    await checkAuth();
});
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
