"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmail = exports.updateEmail = exports.createEmail = exports.getEmail = exports.listEmails = void 0;
const prisma_1 = require("../config/prisma");
const mailer_1 = require("../config/mailer");
const env_1 = require("../config/env");
const pagination_1 = require("../utils/pagination");
const error_handler_1 = require("../middlewares/error-handler");
const listEmails = async (query) => {
    const { page, limit, skip, take } = (0, pagination_1.getPagination)(query.page, query.limit);
    const where = {};
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
    const [items, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.emailMessage.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take
        }),
        prisma_1.prisma.emailMessage.count({ where })
    ]);
    return { items, page, limit, total };
};
exports.listEmails = listEmails;
const getEmail = async (id) => {
    const email = await prisma_1.prisma.emailMessage.findUnique({ where: { id } });
    if (!email) {
        throw new error_handler_1.AppError(404, "EMAIL_NOT_FOUND", "Email not found");
    }
    return email;
};
exports.getEmail = getEmail;
const createEmail = async (data) => {
    const emailRecord = await prisma_1.prisma.emailMessage.create({
        data: {
            to: data.to,
            from: data.from ?? env_1.env.SMTP_FROM ?? "noreply@example.com",
            subject: data.subject,
            text: data.text ?? null,
            html: data.html ?? null,
            relatedContactId: data.relatedContactId ?? null,
            relatedDevisId: data.relatedDevisId ?? null,
            status: "queued"
        }
    });
    try {
        await mailer_1.mailer.sendMail({
            to: emailRecord.to,
            from: emailRecord.from,
            subject: emailRecord.subject,
            text: emailRecord.text ?? undefined,
            html: emailRecord.html ?? undefined
        });
        return prisma_1.prisma.emailMessage.update({
            where: { id: emailRecord.id },
            data: { status: "sent", sentAt: new Date(), error: null }
        });
    }
    catch (error) {
        return prisma_1.prisma.emailMessage.update({
            where: { id: emailRecord.id },
            data: {
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error"
            }
        });
    }
};
exports.createEmail = createEmail;
const updateEmail = async (id, data) => {
    await (0, exports.getEmail)(id);
    return prisma_1.prisma.emailMessage.update({ where: { id }, data });
};
exports.updateEmail = updateEmail;
const deleteEmail = async (id) => {
    await (0, exports.getEmail)(id);
    return prisma_1.prisma.emailMessage.delete({ where: { id } });
};
exports.deleteEmail = deleteEmail;
