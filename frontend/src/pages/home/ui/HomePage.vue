<template>
    <div class="home-page">
        <Hero />
        <SkillGrid />
    </div>
</template>

<script setup lang="ts">
import { Hero } from '@widgets/hero';
import { SkillGrid } from '@widgets/skill-grid';
</script>

<style lang="scss" scoped>
.home-page {
    display: flex;
    flex-direction: column;
}
</style>