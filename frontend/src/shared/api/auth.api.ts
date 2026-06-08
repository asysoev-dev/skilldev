import { apiClient } from './client';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
}

export interface AuthResponse {
    accessToken: string;
    user: {
        id: number;
        email: string;
        name: string;
    };
}

export const authApi = {
    register: (data: RegisterData) => apiClient.post<AuthResponse>('/auth/register', data),

    login: (data: LoginCredentials) => apiClient.post<AuthResponse>('/auth/login', data),

    logout: () => apiClient.post('/auth/logout'),

    refresh: () => apiClient.post<{ accessToken: string }>('/auth/refresh'),

    getMe: () => apiClient.get('/auth/me'),
};
