import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@pages/home/ui/HomePage.vue'),
    },
    {
        path: '/auth',
        name: 'auth',
        component: () => import('@pages/auth/ui/AuthPage.vue'),
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@pages/dashboard/ui/DashboardPage.vue'),
        meta: { requiresAuth: true },
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/auth');
    } else if (to.path === '/auth' && isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});
