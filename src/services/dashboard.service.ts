import { ContactStatus, DevisStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

const contactStatusDefaults: Record<ContactStatus, number> = {
  nouveau: 0,
  en_cours: 0,
  fermee: 0
};

const devisStatusDefaults: Record<DevisStatus, number> = {
  nouveau: 0,
  traite: 0,
  gagne: 0,
  perdu: 0
};

export const getDashboardStats = async () => {
  const [contactsGrouped, devisGrouped] = await prisma.$transaction([
    prisma.contact.groupBy({
      by: ["status"],
      _count: { status: true }
    }),
    prisma.devis.groupBy({
      by: ["status"],
      _count: { status: true }
    })
  ]);

  const contactsByStatus = { ...contactStatusDefaults };
  for (const row of contactsGrouped) {
    contactsByStatus[row.status] = row._count.status;
  }

  const devisByStatus = { ...devisStatusDefaults };
  for (const row of devisGrouped) {
    devisByStatus[row.status] = row._count.status;
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
