import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@entities/user';
import { authApi } from '@shared/api/auth.api';
import type { LoginCredentials, RegisterData } from '@shared/api/auth.api';

const extractError = (err: unknown, fallback: string): string => {
    const apiError = err as { response?: { data?: { error?: string } } };
    return apiError.response?.data?.error ?? fallback;
};

export const useAuth = () => {
    const router = useRouter();
    const userStore = useUserStore();
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const login = async (credentials: LoginCredentials) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data } = await authApi.login(credentials);
            userStore.setToken(data.accessToken);
            userStore.setUser(data.user);
            userStore.setHydrated();
            localStorage.setItem('isAuthorized', 'true');
            await router.push('/dashboard');
            return true;
        } catch (err) {
            error.value = extractError(err, 'Не удалось войти');
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const register = async (payload: RegisterData) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data } = await authApi.register(payload);
            userStore.setToken(data.accessToken);
            userStore.setUser(data.user);
            userStore.setHydrated();
            localStorage.setItem('isAuthorized', '1');
            await router.push('/dashboard');
            return true;
        } catch (err) {
            error.value = extractError(err, 'Не удалось зарегистрироваться');
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const logout = async () => {
        isLoading.value = true;
        try {
            await authApi.logout();
            localStorage.removeItem('isAuthorized');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            userStore.logout();
            await router.push('/auth');
            isLoading.value = false;
        }
    };

    const getAccessToken = () => userStore.token;

    const checkAuth = async (): Promise<boolean> => {
        if (userStore.isAuthenticated) return true;

        if (typeof window !== 'undefined' && !localStorage.getItem('isAuthorized')) {
            userStore.setHydrated();
            return false;
        }

        try {
            const { data: refreshData } = await authApi.refresh();
            userStore.setToken(refreshData.accessToken);

            const { data: user } = await authApi.getMe();
            userStore.setUser(user as unknown as { id: number; email: string; name: string });
            userStore.setHydrated();
            return true;
        } catch {
            localStorage.removeItem('isAuthorized');
            userStore.logout();
            return false;
        }
    };

    return { login, register, logout, checkAuth, getAccessToken, isLoading, error };
};
