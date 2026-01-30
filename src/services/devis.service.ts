import { DevisStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { getPagination } from "../utils/pagination";
import { AppError } from "../middlewares/error-handler";

export const listDevis = async (query: Record<string, string>) => {
  const { page, limit, skip, take } = getPagination(query.page, query.limit);
  const where: Prisma.DevisWhereInput = {};

  if (query.status && Object.values(DevisStatus).includes(query.status as DevisStatus)) {
    where.status = query.status as DevisStatus;
  }

  if (query.search) {
    where.OR = [
      { email: { contains: query.search, mode: "insensitive" } },
      { phone: { contains: query.search, mode: "insensitive" } }
    ];
  }

  if (query.startDate || query.endDate) {
    where.createdAt = {
      gte: query.startDate ? new Date(query.startDate) : undefined,
      lte: query.endDate ? new Date(query.endDate) : undefined
    };
  }

  const [items, total] = await prisma.$transaction([
    prisma.devis.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take
    }),
    prisma.devis.count({ where })
  ]);

  return { items, page, limit, total };
};

export const getDevis = async (id: string) => {
  const devis = await prisma.devis.findUnique({ where: { id } });
  if (!devis) {
    throw new AppError(404, "DEVIS_NOT_FOUND", "Devis not found");
  }
  return devis;
};

export const createDevis = async (data: Prisma.DevisCreateInput) =>
  prisma.devis.create({ data });

export const updateDevis = async (id: string, data: Prisma.DevisUpdateInput) => {
  await getDevis(id);
  return prisma.devis.update({ where: { id }, data });
};

export const deleteDevis = async (id: string) => {
  await getDevis(id);
  return prisma.devis.delete({ where: { id } });
};
