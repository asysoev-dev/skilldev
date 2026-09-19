<template>
    <Modal :open="open" title="Fullstack" subtitle="Node.js, Prisma, PostgreSQL, JWT" size="md" @close="$emit('close')">
        <div class="demo">
            <p class="demo__text">
                Стек: <strong>Node.js</strong>, <strong>Express</strong>, <strong>Prisma</strong>,
                <strong>PostgreSQL</strong>, <strong>JWT</strong>.
            </p>

            <div class="demo__code">
                <div class="demo__code-header">
                    <span>GET /api/leads?limit=2</span>
                    <Tag variant="neon-green" size="sm">200 OK</Tag>
                </div>
                <pre>{{ response }}</pre>
            </div>

            <p class="demo__hint">
                Реальный ответ с прод-API. Данные вымышленные.
            </p>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { Modal, Tag } from '@shared/ui';

interface Props {
    open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{ (e: 'close'): void }>();

const response = `{
  "items": [
    {
      "id": 1,
      "firstName": "Мария",
      "lastName": "Соколов",
      "company": "ИП Смирнов А.В.",
      "status": "proposal",
      "dealAmount": 1403000,
      "manager": "Алексей Сысоев"
    },
    {
      "id": 2,
      "firstName": "Виктория",
      "lastName": "Крылова",
      "company": "ООО «Образование+»",
      "status": "won",
      "dealAmount": 583000,
      "manager": "Мария Иванова"
    }
  ],
  "total": 140,
  "page": 1,
  "limit": 2
}`;
</script>

<style lang="scss" scoped>
@use '@/app/styles/mixins' as *;

.demo {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.demo__text {
    font-size: var(--font-small);
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
}

.demo__code {
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.demo__code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--glass-bg);
    border-bottom: 1px solid var(--border-color);
    font-family: 'Courier New', monospace;
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
}

.demo__code pre {
    margin: 0;
    padding: 12px;
    background: var(--bg-main);
    font-family: 'Courier New', monospace;
    font-size: var(--font-tiny);
    color: var(--text-main);
    overflow-x: auto;
    max-height: 260px;
    line-height: 1.5;
}

.demo__hint {
    font-size: var(--font-tiny);
    color: var(--text-tertiary);
    margin: 0;
    text-align: center;
}
</style>