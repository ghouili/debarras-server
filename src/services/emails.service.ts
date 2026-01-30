import { prisma } from "../config/prisma";
import { mailer } from "../config/mailer";
import { env } from "../config/env";
import { getPagination } from "../utils/pagination";
import { AppError } from "../middlewares/error-handler";

export const listEmails = async (query: Record<string, string>) => {
  const { page, limit, skip, take } = getPagination(query.page, query.limit);
  const where: Record<string, unknown> = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { to: { contains: query.search, mode: "insensitive" } },
      { from: { contains: query.search, mode: "insensitive" } }
    ];
  }

  if (query.startDate || query.endDate) {
    where.createdAt = {
      gte: query.startDate ? new Date(query.startDate) : undefined,
      lte: query.endDate ? new Date(query.endDate) : undefined
    };
  }

  const [items, total] = await prisma.$transaction([
    prisma.emailMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take
    }),
    prisma.emailMessage.count({ where })
  ]);

  return { items, page, limit, total };
};

export const getEmail = async (id: string) => {
  const email = await prisma.emailMessage.findUnique({ where: { id } });
  if (!email) {
    throw new AppError(404, "EMAIL_NOT_FOUND", "Email not found");
  }
  return email;
};

export const createEmail = async (data: {
  to: string;
  from?: string | null;
  subject: string;
  text?: string | null;
  html?: string | null;
  relatedContactId?: string | null;
  relatedDevisId?: string | null;
}) => {
  const emailRecord = await prisma.emailMessage.create({
    data: {
      to: data.to,
      from: data.from ?? env.SMTP_FROM ?? "noreply@example.com",
      subject: data.subject,
      text: data.text ?? null,
      html: data.html ?? null,
      relatedContactId: data.relatedContactId ?? null,
      relatedDevisId: data.relatedDevisId ?? null,
      status: "queued"
    }
  });

  try {
    await mailer.sendMail({
      to: emailRecord.to,
      from: emailRecord.from,
      subject: emailRecord.subject,
      text: emailRecord.text ?? undefined,
      html: emailRecord.html ?? undefined
    });

    return prisma.emailMessage.update({
      where: { id: emailRecord.id },
      data: { status: "sent", sentAt: new Date(), error: null }
    });
  } catch (error) {
    return prisma.emailMessage.update({
      where: { id: emailRecord.id },
      data: {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error"
      }
    });
  }
};

export const updateEmail = async (id: string, data: Record<string, unknown>) => {
  await getEmail(id);
  return prisma.emailMessage.update({ where: { id }, data });
};

export const deleteEmail = async (id: string) => {
  await getEmail(id);
  return prisma.emailMessage.delete({ where: { id } });
};
