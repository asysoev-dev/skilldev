import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../server";

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
