<template>
    <h1>Просто пустой проект [DEPLOY TEST 8]</h1>
    <Button :icon-left="CursorArrowRippleIcon" variant="success" @click="increment"
        >Нажатий: {{ count }}</Button
    >
    <!-- <p v-if="serverTime">Server time: {{ serverTime }}</p> -->
</template>

<script setup lang="ts">
import { ref, onMounted, onServerPrefetch } from 'vue';
import Button from '@/shared/ui/Button/Button.vue';
import { CursorArrowRippleIcon } from '@heroicons/vue/24/outline';
const serverTime = ref('');

onServerPrefetch(async () => {
    // serverTime.value = new Date().toISOString();
});

onMounted(() => {
    // if (!serverTime.value) {
    //     serverTime.value = new Date().toISOString();
    // }
});

const count = ref<number>(0);

const increment = (): void => {
    count.value++;
};
</script>
