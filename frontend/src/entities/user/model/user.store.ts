import { defineStore } from 'pinia';
import type { User, AuthState } from './user.types';

export const useUserStore = defineStore('user', {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
    }),

    actions: {
        setUser(user: User) {
            this.user = user;
            this.isAuthenticated = true;
        },

        setToken(token: string) {
            this.token = token;
            this.isAuthenticated = true;
            localStorage.setItem('token', token);
        },

        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            localStorage.removeItem('token');
        },
    },

    getters: {
        userName: (state) => state.user?.name || 'Guest',
    },
});
