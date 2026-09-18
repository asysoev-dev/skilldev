import { createRouter as createVueRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@entities/user';
import { DefaultLayout } from '@/widgets/layout';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@pages/home/ui/HomePage.vue'),
            },
            {
                path: 'demo/ui',
                name: 'demo-ui',
                component: () => import('@pages/demo-ui/ui/DemoUiPage.vue'),
            },
            {
                path: 'auth',
                name: 'auth',
                component: () => import('@pages/auth/ui/AuthPage.vue'),
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@pages/dashboard/ui/DashboardPage.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'demo/table',
                name: 'demo-table',
                component: () => import('@pages/demo-table/ui/DemoTablePage.vue'),
            },
        ],
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
