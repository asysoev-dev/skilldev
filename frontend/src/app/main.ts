import { createApp } from 'vue';
import App from './App.vue';
import { router } from './providers/router';
import { pinia } from './providers/pinia';

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
