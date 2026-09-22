import { Request, Response } from "express";
import { prisma } from "../server";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateLeads } from "../utils/generateLeads";

import { Prisma, LeadStatus, LeadSource } from "@prisma/client";

const SORTABLE = [
  "id",
  "firstName",
  "lastName",
  "company",
  "statusOrder",
  "manager",
  "dealAmount",
  "city",
  "createdAt",
] as const;

type Sortable = (typeof SORTABLE)[number];

const STATUS_ORDER: Record<LeadStatus, number> = {
  new: 1,
  contacted: 2,
  qualified: 3,
  proposal: 4,
  negotiation: 5,
  won: 6,
  lost: 7,
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search = "",
      status,
      source,
      manager,
      industry,
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "25",
    } = req.query as Record<string, string>;

    const where: Prisma.LeadWhereInput = { AND: [] };
    const and = where.AND as Prisma.LeadWhereInput[];

    if (search) {
      and.push({
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (status) and.push({ status: status as any });
    if (source) and.push({ source: source as any });
    if (manager) and.push({ manager });
    if (industry) and.push({ industry });

    const sortField: Sortable = SORTABLE.includes(sortBy as Sortable)
      ? (sortBy as Sortable)
      : "createdAt";
    const sortOrder: Prisma.SortOrder = order === "asc" ? "asc" : "desc";

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

export const getLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch lead" });
  }
};

export const getFilters = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const [managers, industries] = await Promise.all([
      prisma.lead.findMany({
        distinct: ["manager"],
        select: { manager: true },
      }),
      prisma.lead.findMany({
        distinct: ["industry"],
        select: { industry: true },
      }),
    ]);

    res.json({
      managers: managers.map((m) => m.manager).sort(),
      industries: industries.map((i) => i.industry).sort(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch filters" });
  }
};

const LEAD_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "position",
  "source",
  "status",
  "manager",
  "dealAmount",
  "city",
  "industry",
  "notes",
] as const;

type LeadField = (typeof LEAD_FIELDS)[number];

const pickLeadFields = (body: Record<string, unknown>) => {
  const result: Partial<Record<LeadField, unknown>> = {};
  for (const field of LEAD_FIELDS) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const data = pickLeadFields(req.body);
    const required = [
      "firstName",
      "lastName",
      "email",
      "company",
      "position",
      "source",
      "status",
      "manager",
      "city",
      "industry",
    ];

    for (const field of required) {
      if (!data[field as LeadField]) {
        res.status(400).json({ error: `Field ${field} is required` });
        return;
      }
    }

    const existing = await prisma.lead.findUnique({
      where: { email: data.email as string },
    });
    if (existing) {
      res.status(400).json({ error: "Lead with this email already exists" });
      return;
    }

    const status = data.status as LeadStatus;
    const statusOrder = STATUS_ORDER[status] ?? 0;

    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        email: data.email as string,
        phone: (data.phone as string) ?? null,
        company: data.company as string,
        position: data.position as string,
        source: data.source as LeadSource,
        status,
        statusOrder,
        manager: data.manager as string,
        dealAmount: (data.dealAmount as number) ?? 0,
        city: data.city as string,
        industry: data.industry as string,
        notes: (data.notes as string) ?? null,
        createdById: req.user?.userId ?? null,
      },
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lead" });
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    const data = pickLeadFields(req.body) as Prisma.LeadUpdateInput & {
      statusOrder?: number;
    };

    if (data.status) {
      data.statusOrder = STATUS_ORDER[data.status as LeadStatus] ?? 0;
    }

    const updated = await prisma.lead.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update lead" });
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    await prisma.lead.delete({ where: { id } });
    res.json({ message: "Lead deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete lead" });
  }
};

export const resetLeads = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (req.user?.userId === undefined) {
      res.status(401).json({ error: "Not authorized" });
      return;
    }

    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "Lead" RESTART IDENTITY CASCADE;',
    );

    const leads = generateLeads(140, req.user.userId);
    await prisma.lead.createMany({ data: leads });

    res.json({ count: leads.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset leads" });
  }
};
