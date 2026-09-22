<template>
    <Modal
        :open="state.open"
        :title="state.title || undefined"
        size="sm"
        @close="reject"
    >
        <p class="confirm-dialog__text">{{ state.text }}</p>

        <template #footer>
            <Button variant="outline" @click="reject">
                {{ state.cancelText }}
            </Button>
            <Button :variant="state.variant === 'danger' ? 'danger-action' : 'primary'" @click="accept">
                {{ state.confirmText }}
            </Button>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import Modal from '../Modal/Modal.vue';
import Button from '../Button/Button.vue';
import { useConfirm } from './useConfirm';

const { state, accept, reject } = useConfirm();
</script>

<style lang="scss" scoped>
.confirm-dialog__text {
    font-size: var(--font-body);
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
}
</style>