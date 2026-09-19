<template>
    <Teleport v-if="visible" to="body">
        <Transition name="toast">
            <div v-if="visible" class="toast" :class="`toast--${type}`">
                <div class="toast__icon">
                    <component :is="iconComponent" />
                </div>
                <p class="toast__text">{{ text }}</p>
                <button
                    type="button"
                    class="toast__close"
                    aria-label="Закрыть"
                    @click="$emit('close')"
                >
                    <XMarkIcon />
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';
import {
    XMarkIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Props {
    visible: boolean;
    text: string;
    type?: ToastType;
    duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    duration: 3000,
});

const emit = defineEmits<{ (e: 'close'): void }>();

const iconComponent = computed(() => {
    if (props.type === 'success') return CheckCircleIcon;
    if (props.type === 'warning') return ExclamationTriangleIcon;
    if (props.type === 'error') return ExclamationTriangleIcon;
    return InformationCircleIcon;
});

let timer: number | null = null;

const clearTimer = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
};

watch(
    () => props.visible,
    (visible) => {
        clearTimer();
        if (visible && props.duration > 0) {
            timer = window.setTimeout(() => emit('close'), props.duration);
        }
    },
    { immediate: true }
);

onUnmounted(clearTimer);

onMounted(() => {
    if (props.visible && props.duration > 0) {
        timer = window.setTimeout(() => emit('close'), props.duration);
    }
});

onUnmounted(() => {
    if (timer) clearTimeout(timer);
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.toast {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: $z-toast;
    display: flex;
    align-items: flex-start;
    gap: var(--gap-sm);
    padding: 12px 16px;
    border-radius: var(--radius-md);
    max-width: 380px;
    backdrop-filter: var(--glass-blur);

    body:not(.dark-theme) & {
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    body.dark-theme & {
        background: rgba(30, 30, 40, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    }

    @include respond-down(tablet) {
        top: 16px;
        left: 16px;
        right: 16px;
        max-width: none;
    }
}

.toast--info .toast__icon {
    color: var(--neon-blue);
}
.toast--success .toast__icon {
    color: var(--neon-green);
}
.toast--warning .toast__icon {
    color: var(--neon-yellow);
}
.toast--error .toast__icon {
    color: var(--neon-pink);
}

.toast__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 2px;

    svg {
        width: 100%;
        height: 100%;
    }
}

.toast__text {
    flex: 1;
    font-size: var(--font-small);
    color: var(--text-main);
    line-height: 1.5;
    margin: 0;
}

.toast__close {
    @include focus-ring;

    flex-shrink: 0;
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-tertiary);
    cursor: pointer;
    transition: color var(--transition-base);

    svg {
        width: 100%;
        height: 100%;
    }

    &:hover {
        color: var(--text-main);
    }
}

.toast-enter-active,
.toast-leave-active {
    transition:
        opacity var(--transition-base),
        transform var(--transition-base);
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
</style>
