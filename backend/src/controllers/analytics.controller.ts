import { Request, Response } from 'express';
import { LeadStatus } from '@prisma/client';
import { prisma } from '../server';

const STATUS_ORDER: LeadStatus[] = [
    'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost',
];

export const getTimeline = async (_req: Request, res: Response): Promise<void> => {
    try {
        const since = new Date();
        since.setMonth(since.getMonth() - 11);
        since.setDate(1);
        since.setHours(0, 0, 0, 0);

        const leads = await prisma.lead.findMany({
            where: { createdAt: { gte: since } },
            select: { createdAt: true, closedAt: true, status: true },
        });

        const months: Record<string, { created: number; closed: number }> = {};

        for (let i = 0; i < 12; i++) {
            const d = new Date(since);
            d.setMonth(d.getMonth() + i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            months[key] = { created: 0, closed: 0 };
        }

        for (const lead of leads) {
            const createdKey = `${lead.createdAt.getFullYear()}-${String(lead.createdAt.getMonth() + 1).padStart(2, '0')}`;
            if (months[createdKey]) months[createdKey].created++;

            if (lead.closedAt && (lead.status === 'won' || lead.status === 'lost')) {
                const closedKey = `${lead.closedAt.getFullYear()}-${String(lead.closedAt.getMonth() + 1).padStart(2, '0')}`;
                if (months[closedKey]) months[closedKey].closed++;
            }
        }

        const labels = Object.keys(months);
        res.json({
            labels,
            created: labels.map((k) => months[k].created),
            closed: labels.map((k) => months[k].closed),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch timeline' });
    }
};

export const getSources = async (_req: Request, res: Response): Promise<void> => {
    try {
        const grouped = await prisma.lead.groupBy({
            by: ['source'],
            _count: { _all: true },
        });

        res.json({
            labels: grouped.map((g) => g.source),
            values: grouped.map((g) => g._count._all),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch sources' });
    }
};

export const getFunnel = async (_req: Request, res: Response): Promise<void> => {
    try {
        const grouped = await prisma.lead.groupBy({
            by: ['status'],
            _count: { _all: true },
        });

        const map = Object.fromEntries(grouped.map((g) => [g.status, g._count._all]));

        res.json({
            labels: STATUS_ORDER,
            values: STATUS_ORDER.map((s) => map[s] ?? 0),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch funnel' });
    }
};

export const getManagers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const grouped = await prisma.lead.groupBy({
            by: ['manager', 'status'],
            _count: { _all: true },
        });

        const stats: Record<string, { total: number; won: number }> = {};

        for (const g of grouped) {
            if (!stats[g.manager]) stats[g.manager] = { total: 0, won: 0 };
            stats[g.manager].total += g._count._all;
            if (g.status === 'won') stats[g.manager].won += g._count._all;
        }

        const managers = Object.keys(stats).sort();

        res.json({
            labels: managers,
            values: managers.map((m) =>
                stats[m].total > 0 ? Math.round((stats[m].won / stats[m].total) * 100) : 0
            ),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch managers' });
    }
};