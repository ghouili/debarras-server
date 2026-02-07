import { ContactStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { getPagination } from "../utils/pagination";
import { AppError } from "../middlewares/error-handler";

export const listContacts = async (query: Record<string, string>) => {
  const { page, limit, skip, take } = getPagination(query.page, query.limit);
  const where: Prisma.ContactWhereInput = {};

  if (query.status && Object.values(ContactStatus).includes(query.status as ContactStatus)) {
    where.status = query.status as ContactStatus;
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

export const createContact = async (data: Prisma.ContactCreateInput) =>
  prisma.contact.create({ data });

export const updateContact = async (id: string, data: Prisma.ContactUpdateInput) => {
  await getContact(id);
  return prisma.contact.update({ where: { id }, data });
};

export const updateContactStatus = async (id: string, status: ContactStatus) => {
  await getContact(id);
  return prisma.contact.update({ where: { id }, data: { status } });
};

export const deleteContact = async (id: string) => {
  await getContact(id);
  return prisma.contact.delete({ where: { id } });
};
