"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.listUsers = void 0;
const prisma_1 = require("../config/prisma");
const error_handler_1 = require("../middlewares/error-handler");
const password_1 = require("../utils/password");
const listUsers = async () => prisma_1.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
exports.listUsers = listUsers;
const getUser = async (id) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new error_handler_1.AppError(404, "USER_NOT_FOUND", "User not found");
    }
    return user;
};
exports.getUser = getUser;
const createUser = async (data) => {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
        throw new error_handler_1.AppError(409, "EMAIL_IN_USE", "Email already registered");
    }
    const passwordHash = await (0, password_1.hashPassword)(data.password);
    return prisma_1.prisma.user.create({
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
exports.createUser = createUser;
const updateUser = async (id, data) => {
    await (0, exports.getUser)(id);
    return prisma_1.prisma.user.update({ where: { id }, data });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    await (0, exports.getUser)(id);
    return prisma_1.prisma.user.delete({ where: { id } });
};
exports.deleteUser = deleteUser;
