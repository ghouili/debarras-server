"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = require("../config/prisma");
const contactStatusDefaults = {
    nouveau: 0,
    en_cours: 0,
    fermee: 0
};
const devisStatusDefaults = {
    nouveau: 0,
    traite: 0,
    gagne: 0,
    perdu: 0
};
const getDashboardStats = async () => {
    const [contactsGrouped, devisGrouped] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.contact.groupBy({
            by: ["status"],
            _count: { _all: true },
            orderBy: { status: "asc" }
        }),
        prisma_1.prisma.devis.groupBy({
            by: ["status"],
            _count: { _all: true },
            orderBy: { status: "asc" }
        })
    ]);
    const contactsByStatus = { ...contactStatusDefaults };
    for (const row of contactsGrouped) {
        const count = typeof row._count === "object" && row._count ? row._count._all ?? 0 : 0;
        contactsByStatus[row.status] = count;
    }
    const devisByStatus = { ...devisStatusDefaults };
    for (const row of devisGrouped) {
        const count = typeof row._count === "object" && row._count ? row._count._all ?? 0 : 0;
        devisByStatus[row.status] = count;
    }
    const contactsTotal = Object.values(contactsByStatus).reduce((sum, value) => sum + value, 0);
    const devisTotal = Object.values(devisByStatus).reduce((sum, value) => sum + value, 0);
    return {
        contacts: {
            total: contactsTotal,
            byStatus: contactsByStatus
        },
        devis: {
            total: devisTotal,
            byStatus: devisByStatus
        }
    };
};
exports.getDashboardStats = getDashboardStats;
