import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@entities/user';

const routes = [
    { path: '/', component: () => import('@pages/home/ui/HomePage.vue') },
    { path: '/auth', component: () => import('@pages/auth/ui/AuthPage.vue') },
    {
        path: '/dashboard',
        component: () => import('@pages/dashboard/ui/DashboardPage.vue'),
        meta: { requiresAuth: true },
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
        next('/auth');
    } else if (to.path === '/auth' && userStore.isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});
