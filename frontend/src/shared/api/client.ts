import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useUserStore } from '@entities/user';
import { createRouter } from '@app/providers/router';

interface RefreshResponse {
    accessToken: string;
}

interface ErrorResponse {
    message?: string;
    statusCode?: number;
}

interface RetryableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface QueueItem {
    resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
    reject: (reason?: AxiosError<ErrorResponse>) => void;
    config: RetryableConfig;
}

const API_BASE_URL = process.env.VUE_API_URL as string;

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

let isRefreshing: boolean = false;
let failedQueue: QueueItem[] = [];

const processQueue = async (
    error: AxiosError<ErrorResponse> | null = null,
    token: string | null = null
): Promise<void> => {
    for (const { resolve, reject, config } of failedQueue) {
        if (error) {
            reject(error);
        } else if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            try {
                const response = await apiClient(config);
                resolve(response);
            } catch (err) {
                reject(err as AxiosError<ErrorResponse>);
            }
        }
    }
    failedQueue = [];
};

const router = typeof window !== 'undefined' ? createRouter() : null;

const logoutAndRedirect = async () => {
    const userStore = useUserStore();
    userStore.logout();
    if (router) {
        await router.push('/auth');
    }
};

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const userStore = useUserStore();
        const token = userStore.token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError<ErrorResponse>): Promise<any> => {
        const originalRequest = error.config as RetryableConfig;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const isAuthError = error.response?.status === 401 || error.response?.status === 403;

        if (!isAuthError || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes('/auth/refresh')) {
            await logoutAndRedirect();
            return;
        }

        if (isRefreshing) {
            return new Promise<AxiosResponse>((resolve, reject) => {
                failedQueue.push({ resolve, reject, config: originalRequest });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await apiClient.post<RefreshResponse>('/auth/refresh');
            const userStore = useUserStore();

            userStore.setToken(data.accessToken);

            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }

            await processQueue(null, data.accessToken);

            return await apiClient(originalRequest);
        } catch (refreshError) {
            const axiosError = refreshError as AxiosError<ErrorResponse>;
            await processQueue(axiosError, null);

            await logoutAndRedirect();

            return;
        } finally {
            isRefreshing = false;
        }
    }
);
