import { renderToString } from '@vue/server-renderer';
import { createApp } from '@/app';
import { setServerLang, type Lang } from '@shared/lib/useI18n';

export async function render(url: string, lang: Lang = 'ru') {
    const { app, router, pinia } = createApp();

    setServerLang(lang);

    await router.push(url);
    await router.isReady();

    const html = await renderToString(app);
    const state = JSON.stringify(pinia.state.value);

    return { html, state };
}
