<template>
    <button
        type="button"
        class="burger"
        :class="{ 'burger--open': open }"
        :aria-label="open ? 'Закрыть меню' : 'Открыть меню'"
        :aria-expanded="open"
        @click="emit('click')"
    >
        <span class="burger__line burger__line--top" />
        <span class="burger__line burger__line--middle" />
        <span class="burger__line burger__line--bottom" />
    </button>
</template>

<script setup lang="ts">
interface Props {
    open?: boolean;
}

withDefaults(defineProps<Props>(), { open: false });

const emit = defineEmits<{ (e: 'click'): void }>();
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.burger {
    @include flex(column, center, center);
    @include focus-ring;
    @include touch-target;

    position: relative;
    gap: 5px;
    width: 44px;
    height: 44px;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
}

.burger__line {
    display: block;
    width: 22px;
    height: 2px;
    border-radius: 2px;
    background: var(--text-main);
    transition:
        transform var(--transition-base),
        opacity var(--transition-base);
}

.burger--open .burger__line--top {
    transform: translateY(7px) rotate(45deg);
}

.burger--open .burger__line--middle {
    opacity: 0;
}

.burger--open .burger__line--bottom {
    transform: translateY(-7px) rotate(-45deg);
}
</style>
