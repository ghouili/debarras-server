import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const passwordHash = await hashPassword("Admin1234");
    await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        role: UserRole.admin,
        passwordHash,
        isActive: true,
        isEmailVerified: true
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
