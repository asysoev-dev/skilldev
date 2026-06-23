import { createRouter as createVueRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@entities/user';

import HomePage from '@pages/home/ui/HomePage.vue';
import AuthPage from '@pages/auth/ui/AuthPage.vue';
import DashboardPage from '@pages/dashboard/ui/DashboardPage.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
    {
        path: '/auth',
        name: 'auth',
        component: AuthPage,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true },
    },
];

export function createRouter() {
    const history = typeof window !== 'undefined' ? createWebHistory() : createMemoryHistory();

    const router = createVueRouter({
        history,
        routes,
    });

    router.beforeEach((to, from, next) => {
        if (typeof window === 'undefined') {
            next();
            return;
        }

        const userStore = useUserStore();

        if (to.meta.requiresAuth && !userStore.isAuthenticated) {
            next('/auth');
            return;
        }

        if (to.path === '/auth' && userStore.isAuthenticated) {
            next('/dashboard');
            return;
        }

        next();
    });

    return router;
}
