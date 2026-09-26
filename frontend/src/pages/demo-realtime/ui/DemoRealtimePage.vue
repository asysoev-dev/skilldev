<template>
    <div class="realtime">
        <BackToStands />

        <header class="realtime__header">
            <h1 class="realtime__title">WebSocket</h1>
            <p class="realtime__subtitle">
                WebSocket через socket.io. Онлайн-счётчик и уведомления в реальном времени.
            </p>
        </header>

        <div class="realtime__status" :class="{ 'realtime__status--online': connected }">
            <span class="realtime__status-dot" />
            <span v-if="connected">Соединение установлено</span>
            <span v-else>Соединение потеряно</span>
        </div>

        <div class="realtime__grid tour__step-9">
            <div class="realtime__card">
                <span class="realtime__card-label">Сейчас на сайте</span>
                <span class="realtime__card-value">{{ onlineCount }}</span>
                <span class="realtime__card-hint">
                    Открой вторую вкладку, либо используй смартфон — счётчик вырастет.
                </span>
            </div>
            <div class="realtime__card realtime__card--qr">
                <span class="realtime__card-label">Ссылка для мобильной версии</span>
                <div class="realtime__qr">
                    <QrcodeVue :value="siteUrl" :size="140" level="M" render-as="svg" />
                </div>
                <span class="realtime__card-hint"> Отсканируй QR-код — счётчик вырастет. </span>
            </div>
        </div>

        <div class="realtime__section">
            <h2 class="realtime__section-title">Отправить уведомление</h2>
            <p class="realtime__section-text">Его получат все открытые вкладки этого сайта.</p>

            <form class="realtime__form tour__step-10" @submit.prevent="send">
                <Input v-model="text" placeholder="Текст уведомления..." />
                <Button type="submit" variant="primary" :disabled="!text">Отправить</Button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BackToStands, Input, Button } from '@shared/ui';
import { useWebSocket } from '@shared/lib/useWebSocket';
import { computed } from 'vue';
import QrcodeVue from 'qrcode.vue';

const { connected, onlineCount, sendNotification } = useWebSocket();

const siteUrl = computed(() => {
    if (typeof window === 'undefined') return '';
    return window.location.origin + '/demo/realtime';
});

const text = ref('');

const send = () => {
    if (!text.value.trim()) return;
    sendNotification(text.value, 'info');
    text.value = '';
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.realtime {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    padding: var(--section-spacing) 0;
}

.realtime__header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
}

.realtime__title {
    font-size: var(--font-h1);
    font-weight: 600;
    margin: 0;
}

.realtime__subtitle {
    font-size: var(--font-body);
    color: var(--text-secondary);
    margin: 0;
}

.realtime__status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    align-self: flex-start;
    padding: 8px 14px;
    border-radius: var(--radius-full);
    background: var(--glass-bg);
    border: var(--glass-border);
    font-size: var(--font-small);
    color: var(--text-secondary);
}

.realtime__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-tertiary);
}

.realtime__status--online .realtime__status-dot {
    background: var(--neon-green);
    box-shadow: 0 0 10px var(--neon-green);
}

.realtime__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-md);

    @include respond(tablet) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.realtime__card {
    @include glass;

    padding: var(--card-padding);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
}

.realtime__card-label {
    font-size: var(--font-tiny);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-tertiary);
}

.realtime__card-value {
    font-size: 56px;
    font-weight: 700;
    line-height: 1;
    color: var(--neon-blue);
    font-variant-numeric: tabular-nums;
}

.realtime__card-hint {
    font-size: var(--font-small);
    color: var(--text-secondary);
}

.realtime__section {
    @include glass;

    padding: var(--card-padding);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
}

.realtime__section-title {
    font-size: var(--font-h3);
    font-weight: 600;
    margin: 0;
}

.realtime__section-text {
    font-size: var(--font-small);
    color: var(--text-secondary);
    margin: 0 0 var(--gap-sm);
}

.realtime__form {
    display: flex;
    gap: var(--gap-sm);
    flex-wrap: wrap;
    align-items: flex-start;

    @include respond-down(tablet) {
        flex-direction: column;

        :deep(.button) {
            width: 100%;
        }
    }

    :deep(.input) {
        flex: 1;
        min-width: 200px;
    }

    :deep(.input__message) {
        display: none;
    }

    :deep(.button) {
        min-height: 44px;
    }
}

.realtime__card--qr {
    align-items: center;
    text-align: center;
}

.realtime__qr {
    padding: 12px;
    background: #fff;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
