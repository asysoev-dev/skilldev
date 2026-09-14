<template>
    <div class="parallax-layer" aria-hidden="true">
        <div
            v-for="planet in planets"
            :key="planet.id"
            class="parallax-layer__planet"
            :class="`parallax-layer__planet--${planet.size}`"
            :style="{ transform: move(planet) }"
        />
        <div
            v-for="star in stars"
            :key="star.id"
            class="parallax-layer__star"
            :style="starStyle(star)"
        />
    </div>
</template>

<script setup lang="ts">
import { useParallax } from '@shared/lib/useParallax';
import { planets, stars, type Planet, type Star } from '../model/parallaxElements';

const { x, y, isActive } = useParallax();

const move = ({ speed, axis }: Planet | Star) => {
    if (!isActive.value) return 'translate(0,0)';
    const dx = axis === 'y' ? 0 : x.value * speed * 20;
    const dy = axis === 'x' ? 0 : y.value * speed * 20;
    return `translate(${dx}px, ${dy}px)`;
};

const starStyle = (star: Star) => ({
    width: `${star.size}px`,
    height: `${star.size}px`,
    top: `${star.top}%`,
    left: `${star.left}%`,
    transform: move(star),
});
</script>

<style lang="scss" scoped>
@use '@/app/styles/variables' as *;

.parallax-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: $z-parallax;
    overflow: hidden;
    opacity: var(--planet-opacity);
    transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1);
}

.parallax-layer__planet {
    position: absolute;
    border-radius: 50%;
    will-change: transform;
    transition:
        background var(--transition-theme),
        box-shadow var(--transition-theme);
}

.parallax-layer__planet--big {
    top: -10%;
    right: -5%;
    width: 600px;
    height: 600px;
    background: var(--planet-big-bg);
    box-shadow: var(--planet-big-shadow);
}

.parallax-layer__planet--small {
    bottom: 5%;
    left: 2%;
    width: 220px;
    height: 220px;
    background: var(--planet-small-bg);
    box-shadow: var(--planet-small-shadow);
}

.parallax-layer__star {
    position: absolute;
    border-radius: 50%;
    background: var(--star-color);
    opacity: var(--star-opacity);
    box-shadow: var(--star-shadow);
    will-change: transform;
    transition:
        opacity var(--transition-theme),
        background var(--transition-theme);
}

@media (max-width: 768px) {
    .parallax-layer__planet--big {
        width: 300px;
        height: 300px;
        right: -20%;
    }
    .parallax-layer__planet--small {
        width: 100px;
        height: 100px;
        left: -10%;
    }
    .parallax-layer__star {
        display: none;
    }
}
</style>
