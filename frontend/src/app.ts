import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@app/App.vue';
import { createRouter } from '@app/providers/router';

export function createApp() {
    const app = createSSRApp(App);

    const pinia = createPinia();
    app.use(pinia);

    const router = createRouter();
    app.use(router);

    return { app, router, pinia };
}
