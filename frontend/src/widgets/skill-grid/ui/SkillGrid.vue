<template>
    <section class="skill-grid">
        <h2 class="skill-grid__title">Демо-стенды</h2>
        <p class="skill-grid__subtitle">Мои скиллы — в живом коде.</p>

        <div class="skill-grid__container">
            <SkillCard v-for="skill in skills" :key="skill.id" :skill="skill" />
        </div>
    </section>
</template>

<script setup lang="ts">
import SkillCard from './SkillCard.vue';
import { skills } from '../model/skills';
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.skill-grid {
    padding: var(--section-spacing) 0;
}

.skill-grid__title {
    font-size: var(--font-h2);
    font-weight: 600;
    margin: 0 0 var(--gap-sm);
}

.skill-grid__subtitle {
    font-size: var(--font-body);
    color: var(--text-secondary);
    margin: 0 0 var(--gap-lg);
}

.skill-grid__container {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-md);

    @include respond(tablet) {
        grid-template-columns: repeat(2, 1fr);
    }

    @include respond(desktop) {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
