import { defineStore } from 'pinia';
import type { User, AuthState } from './user.types';

interface State extends AuthState {
    hydrated: boolean;
}

export const useUserStore = defineStore('user', {
    state: (): State => ({
        user: null,
        token: null,
        isAuthenticated: false,
        hydrated: false,
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

        setHydrated() {
            this.hydrated = true;
        },

        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            this.hydrated = true;
        },
    },
});
