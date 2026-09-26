<template>
    <Teleport v-if="open" to="body">
        <Transition name="modal">
            <div
                v-if="open"
                class="modal"
                role="dialog"
                aria-modal="true"
            >
                <div class="modal__panel" :class="`modal__panel--${size}`">
                    <button
                        v-if="closable"
                        type="button"
                        class="modal__close"
                        aria-label="Закрыть"
                        @click="close"
                    >
                        <XMarkIcon />
                    </button>

                    <header v-if="title || $slots.header" class="modal__header">
                        <slot name="header">
                            <h2 class="modal__title">{{ title }}</h2>
                            <p v-if="subtitle" class="modal__subtitle">{{ subtitle }}</p>
                        </slot>
                    </header>

                    <div class="modal__body">
                        <slot />
                    </div>

                    <footer v-if="$slots.footer" class="modal__footer">
                        <slot name="footer" />
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

type Size = 'sm' | 'md' | 'lg';

interface Props {
    open: boolean;
    title?: string;
    subtitle?: string;
    size?: Size;
    closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    subtitle: '',
    size: 'md',
    closable: true,
});

const emit = defineEmits<{ (e: 'close'): void }>();

const close = () => emit('close');

const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.open && props.closable) close();
};

watch(
    () => props.open,
    (open) => {
        document.body.classList.toggle('scroll-lock', open);
        if (open) {
            document.addEventListener('keydown', onEsc);
        } else {
            document.removeEventListener('keydown', onEsc);
        }
    }
);

onUnmounted(() => {
    document.removeEventListener('keydown', onEsc);
    document.body.classList.remove('scroll-lock');
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;
@use '@/app/styles/mixins' as *;

.modal {
    position: fixed;
    inset: 0;
    z-index: $z-modal;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
}

.modal__panel {
    position: relative;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    padding: var(--card-padding);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);

    body:not(.dark-theme) & {
        background: #fff;
        border: 1px solid var(--border-color);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    body.dark-theme & {
        background: #1a1a24;
        border: 1px solid var(--glass-border);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
    }
}

.modal__panel--sm { max-width: 420px; }
.modal__panel--md { max-width: 640px; }
.modal__panel--lg { max-width: 960px; }

.modal__close {
    @include focus-ring;
    @include flex(row, center, center);

    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    z-index: 1;
    transition: all var(--transition-fast);

    svg {
        width: 18px;
        height: 18px;
    }

    &:hover {
        color: var(--text-main);
        background: var(--glass-hover);
    }
}

.modal__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-right: 40px;
}

.modal__title {
    font-size: var(--font-h3);
    font-weight: 600;
    margin: 0;
    color: var(--text-main);
}

.modal__subtitle {
    font-size: var(--font-small);
    color: var(--text-secondary);
    margin: 0;
}

.modal__body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--gap-sm);
    padding-top: var(--gap-md);
    border-top: 1px solid var(--footer-border);
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>