<template>
    <footer class="footer">
        <div class="container footer__inner">
            <div class="footer__links">
                <a
                    v-for="link in links"
                    :key="link.label"
                    :href="link.href"
                    :target="link.external ? '_blank' : undefined"
                    :rel="link.external ? 'noopener noreferrer' : undefined"
                    class="footer__link"
                >
                    <component :is="link.icon" class="footer__icon" />
                    <span>{{ t(link.label) }}</span>
                </a>
            </div>

            <p class="footer__copy">Алексей Сысоев · {{ year }} · {{ t('footer.rights') }}</p>
        </div>
    </footer>
</template>

<script setup lang="ts">
import {
    CodeBracketIcon,
    DocumentTextIcon,
    PaperAirplaneIcon,
    EnvelopeIcon,
} from '@heroicons/vue/24/outline';
import { useI18n } from '@shared/lib/useI18n';

const { t } = useI18n();
const year = new Date().getFullYear();

const links = [
    {
        label: 'footer.github',
        href: 'https://github.com/asysoev-dev/',
        external: true,
        icon: CodeBracketIcon,
    },
    {
        label: 'footer.resume',
        href: '#',
        external: true,
        icon: DocumentTextIcon,
    },
    {
        label: 'footer.telegram',
        href: 'https://t.me/webdev_alex',
        external: true,
        icon: PaperAirplaneIcon,
    },
    {
        label: 'footer.email',
        href: 'mailto:xpost87@mail.ru',
        external: false,
        icon: EnvelopeIcon,
    },
];
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.footer {
    position: relative;
    z-index: 10;
    padding: 40px 0 24px;
    border-top: 1px solid var(--footer-border);
    transition: border-color var(--transition-theme);
}

.footer__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-md);
    text-align: center;

    @include respond(tablet) {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
    }
}

.footer__links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--gap-md);
}

.footer__link {
    @include flex(row, center, center);
    @include focus-ring;

    gap: 8px;
    padding: 8px 12px;
    border-radius: var(--radius-md);
    font-size: var(--font-small);
    color: var(--text-secondary);
    text-decoration: none;
    transition: all var(--transition-base);

    &:hover {
        color: var(--neon-blue);
        background: var(--glass-bg);
        text-decoration: none;
    }
}

.footer__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.footer__copy {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
    margin: 0;
}
</style>
