<template>
    <div class="ui-showcase">
        <BackToStands />
        <h1 class="ui-showcase__title">UI-кит</h1>
        <div class="ui-showcase__subtitle">Страница для проверки компонентов.</div>

        <section class="ui-showcase__section">
            <h2 class="ui-showcase__heading">Кнопки</h2>

            <h3 class="ui-showcase__subheading">Основные</h3>
            <div class="ui-showcase__row">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="text">Text</Button>
            </div>

            <h3 class="ui-showcase__subheading">Неоновые</h3>
            <div class="ui-showcase__row">
                <Button variant="primary-action">Сохранить</Button>
                <Button variant="danger-action">Удалить</Button>
                <Button variant="outline-primary-action">Вход</Button>
                <Button variant="outline-danger-action">Отмена</Button>
            </div>

            <h3 class="ui-showcase__subheading">Размеры</h3>
            <div class="ui-showcase__row">
                <Button size="xs">XS</Button>
                <Button size="sm">SM</Button>
                <Button size="md">MD</Button>
                <Button size="lg">LG</Button>
                <Button size="xl">XL</Button>
            </div>

            <h3 class="ui-showcase__subheading">Состояния</h3>
            <div class="ui-showcase__row">
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" :loading="true">Loading</Button>
                <Button variant="primary" full-width-mobile>Full-width mobile</Button>
            </div>
        </section>

        <section class="ui-showcase__section">
            <h2 class="ui-showcase__heading">Поля ввода</h2>

            <div class="ui-showcase__grid">
                <Input
                    v-model="textValue"
                    label="Обычный"
                    placeholder="Введите текст..."
                    hint="Подсказка"
                />
                <Input
                    v-model="emailValue"
                    type="email"
                    label="Email"
                    placeholder="mail@example.com"
                />
                <Input
                    v-model="passwordValue"
                    type="password"
                    label="Пароль"
                    placeholder="••••••••"
                />
                <Input
                    v-model="searchValue"
                    type="search"
                    label="Поиск"
                    placeholder="Что искать?"
                    clearable
                />
                <Input
                    v-model="errorValue"
                    label="С ошибкой"
                    placeholder="Введите..."
                    error="Обязательное поле"
                />
                <Input v-model="disabledValue" label="Отключен" placeholder="Нельзя" disabled />
            </div>

            <div class="ui-showcase__grid">
                <Textarea
                    v-model="messageValue"
                    label="Сообщение"
                    placeholder="Напишите..."
                    hint="Максимум 500"
                />
                <Textarea
                    v-model="errorTextarea"
                    label="С ошибкой"
                    placeholder="Введите..."
                    error="Слишком коротко"
                />
            </div>
        </section>

        <section class="ui-showcase__section">
            <h2 class="ui-showcase__heading">Выбор</h2>

            <h3 class="ui-showcase__subheading">Чекбоксы</h3>
            <div class="ui-showcase__row">
                <Checkbox v-model="check1" label="Согласен" />
                <Checkbox v-model="check2" label="Рассылка" />
                <Checkbox v-model="check3" label="Отключен" disabled />
            </div>

            <h3 class="ui-showcase__subheading">Радио</h3>
            <div class="ui-showcase__row">
                <Radio v-model="radioValue" value="frontend" name="role" label="Frontend" />
                <Radio v-model="radioValue" value="fullstack" name="role" label="Fullstack" />
                <Radio v-model="radioValue" value="devops" name="role" label="DevOps" />
            </div>
            <p class="ui-showcase__output">
                Выбрано: <strong>{{ radioValue }}</strong>
            </p>
        </section>

        <section class="ui-showcase__section">
            <h2 class="ui-showcase__heading">Свитчи</h2>
            <div class="ui-showcase__row">
                <Switch v-model="switch1" label="Обычный" />
                <Switch v-model="switch2" label="Включен" />
                <Switch v-model="switch3" label="Отключен" disabled />
            </div>
        </section>

        <section class="ui-showcase__section">
            <h2 class="ui-showcase__heading">GlassCard</h2>

            <h3 class="ui-showcase__subheading">Без акцента</h3>
            <div class="ui-showcase__grid">
                <GlassCard>
                    <h4>Обычная</h4>
                    <p>Стеклянная карточка.</p>
                </GlassCard>
                <GlassCard :hoverable="false">
                    <h4>Без hover</h4>
                    <p>Не поднимается.</p>
                </GlassCard>
            </div>

            <h3 class="ui-showcase__subheading">С акцентом</h3>
            <div class="ui-showcase__grid">
                <GlassCard accent="var(--neon-blue)">
                    <h4>Синий</h4>
                    <p>Акцент синий.</p>
                </GlassCard>
                <GlassCard accent="var(--neon-pink)">
                    <h4>Розовый</h4>
                    <p>Акцент розовый.</p>
                </GlassCard>
                <GlassCard accent="var(--neon-green)">
                    <h4>Зелёный</h4>
                    <p>Акцент зелёный.</p>
                </GlassCard>
                <GlassCard accent="var(--neon-yellow)">
                    <h4>Жёлтый</h4>
                    <p>Акцент жёлтый.</p>
                </GlassCard>
            </div>
        </section>

        <section class="ui-showcase__section">
            <h2 class="ui-showcase__heading">Tag</h2>

            <h3 class="ui-showcase__subheading">Варианты</h3>
            <div class="ui-showcase__row">
                <Tag variant="default">Default</Tag>
                <Tag variant="primary">Primary</Tag>
                <Tag variant="success">Success</Tag>
                <Tag variant="danger">Danger</Tag>
                <Tag variant="warning">Warning</Tag>
            </div>

            <h3 class="ui-showcase__subheading">Неоновые</h3>
            <div class="ui-showcase__row">
                <Tag variant="neon-blue">Vue 3</Tag>
                <Tag variant="neon-pink">TypeScript</Tag>
                <Tag variant="neon-yellow">Node.js</Tag>
                <Tag variant="neon-green">Docker</Tag>
                <Tag variant="neon-purple">PostgreSQL</Tag>
            </div>

            <h3 class="ui-showcase__subheading">Размеры и клик</h3>
            <div class="ui-showcase__row">
                <Tag size="sm" variant="neon-blue">SM</Tag>
                <Tag size="md" variant="neon-blue">MD</Tag>
                <Tag variant="neon-pink" clickable>Кликабельный</Tag>
            </div>
        </section>

        <section class="ui-showcase__section">
            <h2 class="ui-showcase__heading">Состояние</h2>
            <pre class="ui-showcase__state">{{ stateString }}</pre>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from '@/shared/ui/Button/Button.vue';
import Input from '@/shared/ui/Input/Input.vue';
import Textarea from '@/shared/ui/Textarea/Textarea.vue';
import Checkbox from '@/shared/ui/Checkbox/Checkbox.vue';
import Radio from '@/shared/ui/Radio/Radio.vue';
import Switch from '@/shared/ui/Switch/Switch.vue';
import GlassCard from '@/shared/ui/GlassCard/GlassCard.vue';
import Tag from '@/shared/ui/Tag/Tag.vue';
import { BackToStands } from '@shared/ui';

const textValue = ref('Привет, мир!');
const emailValue = ref('');
const passwordValue = ref('');
const searchValue = ref('');
const errorValue = ref('');
const disabledValue = ref('Заблокировано');
const messageValue = ref('');
const errorTextarea = ref('');

const check1 = ref(true);
const check2 = ref(false);
const check3 = ref(false);
const radioValue = ref('frontend');
const switch1 = ref(false);
const switch2 = ref(true);
const switch3 = ref(false);

const stateString = computed(() =>
    JSON.stringify(
        {
            text: textValue.value,
            email: emailValue.value,
            password: passwordValue.value,
            search: searchValue.value,
            check1: check1.value,
            check2: check2.value,
            radio: radioValue.value,
            switch1: switch1.value,
            switch2: switch2.value,
        },
        null,
        2
    )
);
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.ui-showcase {
    padding: var(--section-spacing) 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
}

.ui-showcase__title {
    font-size: var(--font-h1);
    margin-bottom: var(--gap-sm);
}

.ui-showcase__subtitle {
    color: var(--text-secondary);
    // margin-bottom: var(--gap-lg);
}

.ui-showcase__section {
    @include glass;
    padding: var(--card-padding);
    border-radius: var(--radius-xl);
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.ui-showcase__heading {
    font-size: var(--font-h2);
    margin-bottom: var(--gap-sm);
}

.ui-showcase__subheading {
    font-size: var(--font-h3);
    color: var(--text-secondary);
    margin-top: var(--gap-md);
    font-weight: 500;
}

.ui-showcase__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-md);
    align-items: center;
}

.ui-showcase__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-md);

    @include respond(tablet) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.ui-showcase__output {
    color: var(--text-secondary);
    font-size: var(--font-small);
    margin-top: var(--gap-sm);

    strong {
        color: var(--neon-blue);
    }
}

.ui-showcase__state {
    background: var(--bg-main);
    padding: var(--gap-md);
    border-radius: var(--radius-md);
    font-family: 'Courier New', monospace;
    font-size: var(--font-small);
    color: var(--text-secondary);
    overflow-x: auto;
    border: 1px solid var(--border-color);
}
</style>
