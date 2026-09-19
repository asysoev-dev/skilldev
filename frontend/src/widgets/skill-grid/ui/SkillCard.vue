<template>
    <div class="skill-card-link" @click="emit('click')">
        <GlassCard :accent="skill.color" class="skill-card">
            <div class="skill-card__icon" :style="{ color: skill.color }">
                <component :is="skill.icon" />
            </div>

            <h3 class="skill-card__title">{{ skill.title }}</h3>
            <p class="skill-card__description">{{ skill.description }}</p>

            <span class="skill-card__arrow" aria-hidden="true">→</span>
        </GlassCard>
    </div>
</template>

<script setup lang="ts">
import type { Skill } from '../model/skills';
import { GlassCard } from '@shared/ui';

interface Props {
    skill: Skill;
}

defineProps<Props>();

const emit = defineEmits<{ (e: 'click'): void }>();
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.skill-card-link {
    text-decoration: none;
    color: inherit;
    display: block;

    &:hover {
        text-decoration: none;
    }
}

.skill-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    position: relative;
    height: 100%;
    transition: transform var(--transition-base);

    .skill-card-link:hover & {
        transform: translateY(-4px);
    }
}

.skill-card__icon {
    width: 40px;
    height: 40px;
    margin-bottom: var(--gap-sm);
    transition: transform var(--transition-base);

    :deep(svg) {
        width: 100%;
        height: 100%;
    }

    .skill-card-link:hover & {
        transform: scale(1.1);
    }
}

.skill-card__title {
    font-size: var(--font-h3);
    font-weight: 600;
    margin: 0;
}

.skill-card__description {
    font-size: var(--font-small);
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

.skill-card__arrow {
    position: absolute;
    top: var(--card-padding);
    right: var(--card-padding);
    font-size: 20px;
    color: var(--neon-blue);
    opacity: 0;
    transform: translateX(-8px);
    transition: all var(--transition-base);

    .skill-card-link:hover & {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>