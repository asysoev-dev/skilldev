import type { Component } from 'vue';
import {
    CodeBracketSquareIcon,
    ServerStackIcon,
    CircleStackIcon,
    RocketLaunchIcon,
    BoltIcon,
    SwatchIcon,
    ChartBarIcon,
    TableCellsIcon,
} from '@heroicons/vue/24/outline';

export interface Skill {
    id: string;
    title: string;
    description: string;
    icon: Component;
    color: string;
    to: string;
}

export const skills: Skill[] = [
    {
        id: 'frontend',
        title: 'Frontend',
        description: 'Vue 3, TypeScript, SCSS, Pinia, Composition API',
        icon: CodeBracketSquareIcon,
        color: 'var(--neon-blue)',
        to: '/demo',
    },
    {
        id: 'fullstack',
        title: 'Fullstack',
        description: 'Node.js, Express, Prisma, PostgreSQL, JWT',
        icon: ServerStackIcon,
        color: 'var(--text-secondary)',
        to: '/demo',
    },
    {
        id: 'devops',
        title: 'DevOps',
        description: 'Docker, Nginx, GitHub Actions, Let\u2019s Encrypt',
        icon: CircleStackIcon,
        color: 'var(--text-secondary)',
        to: '/demo',
    },
    {
        id: 'ssr',
        title: 'SSR',
        description: 'Свой SSR на Express, гидратация, SEO',
        icon: RocketLaunchIcon,
        color: 'var(--text-secondary)',
        to: '/demo',
    },
    {
        id: 'realtime',
        title: 'Real-time',
        description: 'WebSocket, socket.io, online-юзеры',
        icon: BoltIcon,
        color: 'var(--neon-yellow)',
        to: '/demo/realtime',
    },
    {
        id: 'ui-kit',
        title: 'UI-кит',
        description: 'Кнопки, инпуты, чекбоксы, свитчи, теги',
        icon: SwatchIcon,
        color: 'var(--text-secondary)',
        to: '/demo/ui',
    },
    {
        id: 'charts',
        title: 'Charts',
        description: 'Chart.js, воронка, аналитика, графики',
        icon: ChartBarIcon,
        color: 'var(--text-secondary)',
        to: '/demo/charts',
    },
    {
        id: 'table',
        title: 'Data Table',
        description: 'Поиск, сортировка, фильтры, пагинация, CSV',
        icon: TableCellsIcon,
        color: 'var(--text-secondary)',
        to: '/demo/table',
    },
];
