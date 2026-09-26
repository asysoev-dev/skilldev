<template>
    <div class="auth">
        <BackToStands />

        <div class="auth__container">
            <div class="auth__card tour__step-11">
                <header class="auth__header">
                    <h1 class="auth__title">
                        {{ isLogin ? t('auth.login') : t('auth.register') }}
                    </h1>
                    <p class="auth__subtitle">
                        {{ isLogin ? t('auth.login.subtitle') : t('auth.register.subtitle') }}
                    </p>
                </header>

                <div class="auth__tabs">
                    <button
                        type="button"
                        class="auth__tab"
                        :class="{ 'auth__tab--active': isLogin }"
                        @click="isLogin = true"
                    >
                        {{ t('auth.login') }}
                    </button>
                    <button
                        type="button"
                        class="auth__tab"
                        :class="{ 'auth__tab--active': !isLogin }"
                        @click="isLogin = false"
                    >
                        {{ t('auth.register') }}
                    </button>
                </div>

                <form class="auth__form" @submit.prevent="handleSubmit">
                    <Input
                        v-if="!isLogin"
                        v-model="form.name"
                        :label="t('auth.name')"
                        placeholder="..."
                    />
                    <Input
                        v-model="form.email"
                        type="email"
                        :label="t('auth.email')"
                        placeholder="mail@example.com"
                    />
                    <Input
                        v-model="form.password"
                        type="password"
                        :label="t('auth.password')"
                        placeholder="••••••••"
                    />

                    <p v-if="error" class="auth__error">{{ error }}</p>

                    <Button type="submit" variant="primary" full-width :loading="isLoading">
                        {{ isLogin ? t('auth.submit.login') : t('auth.submit.register') }}
                    </Button>
                </form>

                <div class="auth__divider">
                    <span>{{ t('auth.divider') }}</span>
                </div>

                <Button
                    class="tour__step-111"
                    variant="outline-primary-action"
                    full-width
                    :icon-left="SparklesIcon"
                    :loading="isDemoLoading"
                    @click="handleDemoLogin"
                >
                    {{ t('auth.demo') }}
                </Button>

                <p class="auth__hint">{{ t('auth.demo.hint') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { SparklesIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '@features/auth/model/useAuth';
import { BackToStands, Button, Input } from '@shared/ui';
import { useI18n } from '@shared/lib/useI18n';

const { login, register, isLoading, error } = useAuth();

const { t } = useI18n();
const isLogin = ref(true);
const isDemoLoading = ref(false);

const form = reactive({
    name: '',
    email: '',
    password: '',
});

const handleSubmit = async () => {
    if (isLogin.value) {
        await login({ email: form.email, password: form.password });
    } else {
        await register({
            email: form.email,
            password: form.password,
            name: form.name,
        });
    }
};

const handleDemoLogin = async () => {
    isDemoLoading.value = true;
    try {
        await login({
            email: 'demo@skilldev.ru',
            password: 'demo123',
        });
    } finally {
        isDemoLoading.value = false;
    }
};
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.auth {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    padding: var(--section-spacing) 0;
}

.auth__container {
    display: flex;
    justify-content: center;
}

.auth__card {
    @include glass;

    width: 100%;
    max-width: 440px;
    padding: var(--card-padding);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
}

.auth__header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    text-align: center;
}

.auth__title {
    font-size: var(--font-h2);
    font-weight: 600;
    margin: 0;
}

.auth__subtitle {
    font-size: var(--font-small);
    color: var(--text-secondary);
    margin: 0;
}

.auth__tabs {
    display: flex;
    gap: 4px;
    padding: 4px;
    border-radius: var(--radius-md);
    background: var(--glass-bg);
    border: 1px solid var(--border-color);
}

.auth__tab {
    @include focus-ring;

    flex: 1;
    padding: 10px;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    font-family: inherit;
    font-size: var(--font-small);
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-base);

    &:hover {
        color: var(--text-main);
    }
}

.auth__tab--active {
    background: var(--neon-blue);
    color: #08080c;

    &:hover {
        color: #08080c;
    }
}

.auth__form {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.auth__error {
    padding: 10px 14px;
    border-radius: var(--radius-md);
    background: rgba(255, 59, 92, 0.1);
    border: 1px solid rgba(255, 59, 92, 0.3);
    font-size: var(--font-small);
    color: var(--neon-pink);
    margin: 0;
}

.auth__divider {
    position: relative;
    text-align: center;
    color: var(--text-tertiary);
    font-size: var(--font-tiny);

    &::before,
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 42%;
        height: 1px;
        background: var(--border-color);
    }

    &::before {
        left: 0;
    }
    &::after {
        right: 0;
    }

    span {
        background: var(--bg-main);
        padding: 0 12px;
        position: relative;
        z-index: 1;
    }
}

.auth__hint {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
    margin: 0;
    text-align: center;
}
</style>
