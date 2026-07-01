import { createApp } from '@/app';
import '@/app/styles/main.scss'
const { app, router, pinia } = createApp();

if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    pinia.state.value = window.__INITIAL_STATE__;
}

router.isReady().then(() => {
    app.mount('#app');
});
