import { renderToString } from '@vue/server-renderer';
import { createApp } from '@/app';

export async function render(url: string) {
    const { app, router, pinia } = createApp();

    await router.push(url);
    await router.isReady();

    const html = await renderToString(app);
    const state = JSON.stringify(pinia.state.value);

    return { html, state };
}
