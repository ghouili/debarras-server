"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDevis = exports.updateDevisStatus = exports.updateDevis = exports.createDevis = exports.getDevis = exports.listDevis = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
const pagination_1 = require("../utils/pagination");
const error_handler_1 = require("../middlewares/error-handler");
const listDevis = async (query) => {
    const { page, limit, skip, take } = (0, pagination_1.getPagination)(query.page, query.limit);
    const where = {};
    if (query.status && Object.values(client_1.DevisStatus).includes(query.status)) {
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
        prisma_1.prisma.devis.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take
        }),
        prisma_1.prisma.devis.count({ where })
    ]);
    return { items, page, limit, total };
};
exports.listDevis = listDevis;
const getDevis = async (id) => {
    const devis = await prisma_1.prisma.devis.findUnique({ where: { id } });
    if (!devis) {
        throw new error_handler_1.AppError(404, "DEVIS_NOT_FOUND", "Devis not found");
    }
    return devis;
};
exports.getDevis = getDevis;
const createDevis = async (data) => prisma_1.prisma.devis.create({ data });
exports.createDevis = createDevis;
const updateDevis = async (id, data) => {
    await (0, exports.getDevis)(id);
    return prisma_1.prisma.devis.update({ where: { id }, data });
};
exports.updateDevis = updateDevis;
const updateDevisStatus = async (id, status) => {
    await (0, exports.getDevis)(id);
    return prisma_1.prisma.devis.update({ where: { id }, data: { status } });
};
exports.updateDevisStatus = updateDevisStatus;
const deleteDevis = async (id) => {
    await (0, exports.getDevis)(id);
    return prisma_1.prisma.devis.delete({ where: { id } });
};
exports.deleteDevis = deleteDevis;
