"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.createPasswordReset = exports.revokeRefreshToken = exports.rotateRefreshToken = exports.issueTokens = exports.loginUser = exports.registerUser = void 0;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
const env_1 = require("../config/env");
const error_handler_1 = require("../middlewares/error-handler");
const jwt_1 = require("../utils/jwt");
const registerUser = async (data) => {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
        throw new error_handler_1.AppError(409, "EMAIL_IN_USE", "Email already registered");
    }
    const passwordHash = await (0, password_1.hashPassword)(data.password);
    const user = await prisma_1.prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone ?? null,
            passwordHash,
            isEmailVerified: !env_1.isEmailVerificationRequired
        }
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new error_handler_1.AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }
    if (!user.isActive) {
        throw new error_handler_1.AppError(403, "USER_INACTIVE", "User is inactive");
    }
    if (env_1.isEmailVerificationRequired && !user.isEmailVerified) {
        throw new error_handler_1.AppError(403, "EMAIL_NOT_VERIFIED", "Email not verified");
    }
    const valid = await (0, password_1.verifyPassword)(password, user.passwordHash);
    if (!valid) {
        throw new error_handler_1.AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }
    return user;
};
exports.loginUser = loginUser;
const issueTokens = async (userId, role) => {
    const accessToken = (0, jwt_1.signAccessToken)({ sub: userId, role });
    const refreshToken = (0, token_1.generateRandomToken)();
    const refreshTokenHash = (0, token_1.hashToken)(refreshToken);
    const expiresAt = new Date(Date.now() + parseDuration(env_1.env.JWT_REFRESH_TTL));
    await prisma_1.prisma.refreshToken.create({
        data: {
            userId,
            tokenHash: refreshTokenHash,
            expiresAt
        }
    });
    return { accessToken, refreshToken, expiresAt };
};
exports.issueTokens = issueTokens;
const rotateRefreshToken = async (refreshToken) => {
    const tokenHash = (0, token_1.hashToken)(refreshToken);
    const tokenRecord = await prisma_1.prisma.refreshToken.findFirst({
        where: {
            tokenHash,
            revokedAt: null,
            expiresAt: { gt: new Date() }
        }
    });
    if (!tokenRecord) {
        throw new error_handler_1.AppError(401, "INVALID_REFRESH", "Invalid refresh token");
    }
    await prisma_1.prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { revokedAt: new Date() }
    });
    const user = await prisma_1.prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) {
        throw new error_handler_1.AppError(401, "INVALID_REFRESH", "Invalid refresh token");
    }
    return (0, exports.issueTokens)(user.id, user.role);
};
exports.rotateRefreshToken = rotateRefreshToken;
const revokeRefreshToken = async (refreshToken) => {
    const tokenHash = (0, token_1.hashToken)(refreshToken);
    await prisma_1.prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() }
    });
};
exports.revokeRefreshToken = revokeRefreshToken;
const createPasswordReset = async (email) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return null;
    }
    const token = (0, token_1.generateRandomToken)();
    const tokenHash = (0, token_1.hashToken)(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    await prisma_1.prisma.passwordResetToken.create({
        data: {
            userId: user.id,
            tokenHash,
            expiresAt
        }
    });
    return { token, user };
};
exports.createPasswordReset = createPasswordReset;
const resetPassword = async (token, newPassword) => {
    const tokenHash = (0, token_1.hashToken)(token);
    const record = await prisma_1.prisma.passwordResetToken.findFirst({
        where: {
            tokenHash,
            usedAt: null,
            expiresAt: { gt: new Date() }
        }
    });
    if (!record) {
        throw new error_handler_1.AppError(400, "INVALID_RESET", "Invalid or expired reset token");
    }
    const passwordHash = await (0, password_1.hashPassword)(newPassword);
    await prisma_1.prisma.$transaction([
        prisma_1.prisma.passwordResetToken.update({
            where: { id: record.id },
            data: { usedAt: new Date() }
        }),
        prisma_1.prisma.user.update({
            where: { id: record.userId },
            data: { passwordHash }
        })
    ]);
};
exports.resetPassword = resetPassword;
const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new error_handler_1.AppError(404, "USER_NOT_FOUND", "User not found");
    }
    const valid = await (0, password_1.verifyPassword)(currentPassword, user.passwordHash);
    if (!valid) {
        throw new error_handler_1.AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }
    const passwordHash = await (0, password_1.hashPassword)(newPassword);
    await prisma_1.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
};
exports.changePassword = changePassword;
const parseDuration = (value) => {
    const match = value.match(/^(\d+)([smhd])$/);
    if (!match) {
        return 1000 * 60 * 60 * 24 * 30;
    }
    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers = {
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24
    };
    return amount * multipliers[unit];
};
