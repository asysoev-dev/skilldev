<template>
    <div class="container">
        <h1>Просто пустой проект [DELOY TEST 5]</h1>
        <button @click="increment">Нажатий: {{ count }}</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0);

const increment = (): void => {
    count.value++;
};
</script>

<style scoped>
.container {
    text-align: center;
    margin-top: 50px;
    font-family: Arial, sans-serif;
}
button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 5px;
}
button:hover {
    background-color: #35495e;
}
</style>
