import { apiClient } from './client';
import type { User } from '@entities/user';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export const authApi = {
    register: (data: RegisterData) => apiClient.post<AuthResponse>('/auth/register', data),

    login: (data: LoginCredentials) => apiClient.post<AuthResponse>('/auth/login', data),

    logout: () => apiClient.post('/auth/logout'),

    refresh: () => apiClient.post<{ accessToken: string }>('/auth/refresh'),

    getMe: () => apiClient.get<User>('/auth/me'),
};
