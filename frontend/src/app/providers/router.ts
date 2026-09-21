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
            {
                path: 'demo/charts',
                name: 'demo-charts',
                component: () => import('@pages/demo-charts/ui/DemoChartsPage.vue'),
            },
            {
                path: 'demo/realtime',
                name: 'demo-realtime',
                component: () => import('@pages/demo-realtime/ui/DemoRealtimePage.vue'),
            },
        ],
    },
];

export function createRouter() {
    const history = typeof window !== 'undefined' ? createWebHistory() : createMemoryHistory();

    const router = createVueRouter({
        history,
        routes,
        scrollBehavior(to, _from, savedPosition) {
            if (savedPosition) return savedPosition;
            if (to.hash) {
                return {
                    el: to.hash,
                    behavior: 'smooth',
                    // top: 80,
                };
            }
            return { top: 0, behavior: 'smooth' };
        },
    });

    router.beforeEach(async (to) => {
        if (typeof window === 'undefined') return true;

        const userStore = useUserStore();

        if (to.meta.requiresAuth) {
            if (userStore.isAuthenticated) return true;

            // тихо пробуем refresh
            try {
                const { authApi } = await import('@shared/api/auth.api');
                const { data } = await authApi.refresh();
                userStore.setToken(data.accessToken);

                const { data: user } = await authApi.getMe();
                userStore.setUser(user as any);
                userStore.setHydrated();
                return true;
            } catch {
                userStore.logout();
                return { path: '/auth' };
            }
        }

        if (to.path === '/auth' && userStore.isAuthenticated) {
            return { path: '/dashboard' };
        }

        return true;
    });

    return router;
}
