import { defineStore } from 'pinia';
import type { User, AuthState } from './user.types';

export const useUserStore = defineStore('user', {
    state: (): AuthState => ({
        user: null,
        token: null,
        isAuthenticated: false,
    }),

    actions: {
        setUser(user: User) {
            this.user = user;
            this.isAuthenticated = true;
        },

        setToken(token: string) {
            this.token = token;
            this.isAuthenticated = true;
        },

        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
        },
    },

    getters: {},
});
