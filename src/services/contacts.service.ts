import { prisma } from "../config/prisma";
import { getPagination } from "../utils/pagination";
import { AppError } from "../middlewares/error-handler";

export const listContacts = async (query: Record<string, string>) => {
  const { page, limit, skip, take } = getPagination(query.page, query.limit);
  const where: Record<string, unknown> = {};

  if (query.status) {
    where.status = query.status;
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
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take
    }),
    prisma.contact.count({ where })
  ]);

  return { items, page, limit, total };
};

export const getContact = async (id: string) => {
  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) {
    throw new AppError(404, "CONTACT_NOT_FOUND", "Contact not found");
  }
  return contact;
};

export const createContact = async (data: Record<string, unknown>) =>
  prisma.contact.create({ data });

export const updateContact = async (id: string, data: Record<string, unknown>) => {
  await getContact(id);
  return prisma.contact.update({ where: { id }, data });
};

export const deleteContact = async (id: string) => {
  await getContact(id);
  return prisma.contact.delete({ where: { id } });
};
