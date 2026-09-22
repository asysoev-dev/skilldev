import { ref } from 'vue';

export interface ConfirmOptions {
    title?: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger';
}

interface ConfirmState extends ConfirmOptions {
    open: boolean;
    resolve: ((value: boolean) => void) | null;
}

const state = ref<ConfirmState>({
    open: false,
    title: '',
    text: '',
    confirmText: 'ОК',
    cancelText: 'Отмена',
    variant: 'default',
    resolve: null,
});

export function useConfirm() {
    const confirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            state.value = {
                open: true,
                title: options.title ?? '',
                text: options.text,
                confirmText: options.confirmText ?? 'ОК',
                cancelText: options.cancelText ?? 'Отмена',
                variant: options.variant ?? 'default',
                resolve,
            };
        });
    };

    const accept = () => {
        state.value.resolve?.(true);
        state.value.open = false;
        state.value.resolve = null;
    };

    const reject = () => {
        state.value.resolve?.(false);
        state.value.open = false;
        state.value.resolve = null;
    };

    return { state, confirm, accept, reject };
}