<template>
    <section id="skills" class="skill-grid">
        <h2 class="skill-grid__title">{{ t('skills.title') }}</h2>
        <p class="skill-grid__subtitle">{{ t('skills.subtitle') }}</p>

        <div class="skill-grid__container">
            <SkillCard
                v-for="skill in skills"
                :key="skill.id"
                :skill="{
                    ...skill,
                    title: t(`skills.${skill.id}.title`),
                    description: t(`skills.${skill.id}.description`),
                }"
                @click="openModal(skill)"
            />
        </div>

        <FrontendDemo :open="activeModal === 'frontend'" @close="closeModal" />
        <FullstackDemo :open="activeModal === 'fullstack'" @close="closeModal" />
        <DevOpsDemo :open="activeModal === 'devops'" @close="closeModal" />
        <SSRDemo :open="activeModal === 'ssr'" @close="closeModal" />
        <UIKitDemo :open="activeModal === 'ui-kit'" @close="closeModal" />
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SkillCard from './SkillCard.vue';
import { skills, type Skill } from '../model/skills';
import { FrontendDemo, FullstackDemo, DevOpsDemo, SSRDemo, UIKitDemo } from '@features/demo-modal';
import { useI18n } from '@shared/lib/useI18n';

const { t } = useI18n();
const router = useRouter();
const activeModal = ref<string | null>(null);

const MODAL_IDS = ['frontend', 'fullstack', 'devops', 'ssr', 'ui-kit'];

const openModal = (skill: Skill) => {
    if (MODAL_IDS.includes(skill.id)) {
        activeModal.value = skill.id;
        return;
    }
    router.push(skill.to);
};

const closeModal = () => {
    activeModal.value = null;
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.skill-grid {
    padding: var(--section-spacing) 0;
    scroll-margin-top: 80px;
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
