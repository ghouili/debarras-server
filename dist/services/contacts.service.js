"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContactStatus = exports.updateContact = exports.createContact = exports.getContact = exports.listContacts = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
const pagination_1 = require("../utils/pagination");
const error_handler_1 = require("../middlewares/error-handler");
const listContacts = async (query) => {
    const { page, limit, skip, take } = (0, pagination_1.getPagination)(query.page, query.limit);
    const where = {};
    if (query.status && Object.values(client_1.ContactStatus).includes(query.status)) {
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
    const [items, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.contact.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take
        }),
        prisma_1.prisma.contact.count({ where })
    ]);
    return { items, page, limit, total };
};
exports.listContacts = listContacts;
const getContact = async (id) => {
    const contact = await prisma_1.prisma.contact.findUnique({ where: { id } });
    if (!contact) {
        throw new error_handler_1.AppError(404, "CONTACT_NOT_FOUND", "Contact not found");
    }
    return contact;
};
exports.getContact = getContact;
const createContact = async (data) => prisma_1.prisma.contact.create({ data });
exports.createContact = createContact;
const updateContact = async (id, data) => {
    await (0, exports.getContact)(id);
    return prisma_1.prisma.contact.update({ where: { id }, data });
};
exports.updateContact = updateContact;
const updateContactStatus = async (id, status) => {
    await (0, exports.getContact)(id);
    return prisma_1.prisma.contact.update({ where: { id }, data: { status } });
};
exports.updateContactStatus = updateContactStatus;
const deleteContact = async (id) => {
    await (0, exports.getContact)(id);
    return prisma_1.prisma.contact.delete({ where: { id } });
};
exports.deleteContact = deleteContact;
