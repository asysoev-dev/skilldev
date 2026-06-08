import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/entities/user';
import { authApi } from '@/shared/api/auth.api';
import type { LoginCredentials, RegisterData } from '@/shared/api/auth.api';

interface ApiError {
    response?: {
        data?: {
            error?: string;
        };
    };
}

export const useAuth = () => {
    const router = useRouter();
    const userStore = useUserStore();
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    /**
     * Логин пользователя
     *
     * @param {LoginCredentials} credentials - email и пароль
     * @returns {Promise<boolean>} true - успех, false - ошибка
     * @description При успехе: сохраняет токен в store, редирект на /dashboard
     */

    const login = async (credentials: LoginCredentials) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data: response } = await authApi.login(credentials);

            userStore.setToken(response.accessToken);
            userStore.setUser(response.user);
            await router.push('/dashboard');
            return true;
        } catch (err: unknown) {
            const apiError = err as ApiError;
            error.value = apiError.response?.data?.error || 'Login failed';
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Регистрация пользователя
     *
     * @param {RegisterData} data - email, password, name
     * @returns {Promise<boolean>} true - успех, false - ошибка
     */

    const register = async (data: RegisterData) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data: response } = await authApi.register(data);

            userStore.setToken(response.accessToken);
            userStore.setUser(response.user);
            await router.push('/dashboard');
            return true;
        } catch (err: unknown) {
            const apiError = err as ApiError;
            error.value = apiError.response?.data?.error || 'Registration failed';
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Выход из системы
     *
     * @returns {Promise<void>}
     * @description Очищает сессию на сервере и в store, редирект на /auth
     */

    const logout = async () => {
        isLoading.value = true;
        try {
            await authApi.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            userStore.logout();
            await router.push('/auth');
            isLoading.value = false;
        }
    };

    /**
     * Получение текущего access token
     *
     * @returns {string|null} Токен или null
     */

    const getAccessToken = () => userStore.token;

    /**
     * Проверка авторизации с автоматическим обновлением токена
     *
     * @returns {Promise<boolean>} true - авторизован, false - нет
     * @description Если токен есть - возвращает true, иначе пробует обновить через refresh
     */

    const checkAuth = async () => {
        if (userStore.token) {
            return true;
        }

        try {
            const { data } = await authApi.refresh();
            userStore.setToken(data.accessToken);
            const userData = await authApi.getMe();
            userStore.setUser(userData.data);
            return true;
        } catch {
            userStore.logout();
            return false;
        }
    };

    return { login, register, logout, checkAuth, getAccessToken, isLoading, error };
};
