import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateLeads } from './utils/generateLeads';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const demoPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@skilldev.ru' },
        update: { role: 'admin', isDemo: true },
        create: {
            email: 'demo@skilldev.ru',
            password: demoPassword,
            name: 'Демо-пользователь',
            role: 'admin',
            isDemo: true,
        },
    });
    console.log('Demo user: demo@skilldev.ru / demo123');

    const existing = await prisma.lead.count();
    if (existing > 0) {
        console.log(`${existing} leads already exist, skipping`);
        return;
    }

    const leads = generateLeads(140, demoUser.id);
    await prisma.lead.createMany({ data: leads });
    console.log(`Created ${leads.length} leads`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });