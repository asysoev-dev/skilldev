export interface User {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';
    isDemo: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}
