import { prisma } from "../config/prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateRandomToken, hashToken } from "../utils/token";
import { env, isEmailVerificationRequired } from "../config/env";
import { AppError } from "../middlewares/error-handler";
import { signAccessToken } from "../utils/jwt";

export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  password: string;
}) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError(409, "EMAIL_IN_USE", "Email already registered");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      passwordHash,
      isEmailVerified: !isEmailVerificationRequired
    }
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  if (!user.isActive) {
    throw new AppError(403, "USER_INACTIVE", "User is inactive");
  }

  if (isEmailVerificationRequired && !user.isEmailVerified) {
    throw new AppError(403, "EMAIL_NOT_VERIFIED", "Email not verified");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  return user;
};

export const issueTokens = async (userId: string, role: string) => {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = generateRandomToken();
  const refreshTokenHash = hashToken(refreshToken);

  const expiresAt = new Date(Date.now() + parseDuration(env.JWT_REFRESH_TTL));

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: refreshTokenHash,
      expiresAt
    }
  });

  return { accessToken, refreshToken, expiresAt };
};

export const rotateRefreshToken = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  const tokenRecord = await prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  if (!tokenRecord) {
    throw new AppError(401, "INVALID_REFRESH", "Invalid refresh token");
  }

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { revokedAt: new Date() }
  });

  const user = await prisma.user.findUnique({ where: { id: tokenRecord.userId } });
  if (!user) {
    throw new AppError(401, "INVALID_REFRESH", "Invalid refresh token");
  }

  return issueTokens(user.id, user.role);
};

export const revokeRefreshToken = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() }
  });
};

export const createPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const token = generateRandomToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt
    }
  });

  return { token, user };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const tokenHash = hashToken(token);
  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  if (!record) {
    throw new AppError(400, "INVALID_RESET", "Invalid or expired reset token");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() }
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash }
    })
  ]);
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
};

const parseDuration = (value: string) => {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 1000 * 60 * 60 * 24 * 30;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24
  };
  return amount * multipliers[unit];
};
