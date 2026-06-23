import { createApp } from '@/app';

const { app, router, pinia } = createApp();

app.use(pinia);

if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    pinia.state.value = window.__INITIAL_STATE__;
}

router.isReady().then(() => {
    app.mount('#app');
});
