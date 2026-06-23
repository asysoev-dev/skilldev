<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-tabs">
                <button :class="{ active: isLoginMode }" @click="isLoginMode = true">Login</button>
                <button :class="{ active: !isLoginMode }" @click="isLoginMode = false">
                    Register
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="auth-form">
                <div v-if="!isLoginMode" class="form-group">
                    <label>Name</label>
                    <input v-model="form.name" type="text" required />
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input v-model="form.email" type="email" required />
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input v-model="form.password" type="password" required />
                </div>

                <div v-if="error" class="error-message">{{ error }}</div>

                <button type="submit" :disabled="isLoading">
                    {{ isLoading ? 'Loading...' : isLoginMode ? 'Login' : 'Register' }}
                </button>
                <button
                    type="submit"
                    :disabled="isLoading"
                    style="margin-top: 0.5rem"
                    @click="testLogin"
                >
                    {{ isLoading ? 'Loading...' : 'Test' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuth } from '@features/auth/model/useAuth';

const { login, register, isLoading, error } = useAuth();
const isLoginMode = ref(true);

const form = reactive({
    email: '',
    password: '',
    name: '',
});

const handleSubmit = async () => {
    if (isLoginMode.value) {
        await login({ email: form.email, password: form.password });
    } else {
        await register({ email: form.email, password: form.password, name: form.name });
    }
};
const testLogin = async () => {
    await login({ email: 'test@skilldev.ru', password: '123456' });
};
</script>

<style scoped>
.auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
}

.auth-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    overflow: hidden;
}

.auth-tabs {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
}

.auth-tabs button {
    flex: 1;
    padding: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
}

.auth-tabs button.active {
    background: #42b983;
    color: white;
}

.auth-form {
    padding: 2rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.error-message {
    background: #fee;
    color: #c33;
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

button[type='submit'] {
    width: 100%;
    padding: 0.75rem;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
}

button[type='submit']:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
