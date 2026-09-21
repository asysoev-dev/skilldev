import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@app/App.vue';
import { createRouter } from '@app/providers/router';
import { setRouterInstance } from '@app/providers/router-instance';

export function createApp() {
    const app = createSSRApp(App);

    const pinia = createPinia();
    app.use(pinia);

    const router = createRouter();
    app.use(router);
    setRouterInstance(router);

    return { app, router, pinia };
}
