import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error-handler";
import { hashPassword } from "../utils/password";

export const listUsers = async () => prisma.user.findMany({ orderBy: { createdAt: "desc" } });

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }
  return user;
};

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role?: "admin" | "agent" | "viewer";
  password: string;
}) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError(409, "EMAIL_IN_USE", "Email already registered");
  }

  const passwordHash = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      role: data.role ?? "agent",
      passwordHash,
      isActive: true
    }
  });
};

export const updateUser = async (id: string, data: Record<string, unknown>) => {
  await getUser(id);
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: string) => {
  await getUser(id);
  return prisma.user.delete({ where: { id } });
};
