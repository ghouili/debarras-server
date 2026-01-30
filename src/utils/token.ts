import crypto from "crypto";

export const generateRandomToken = (size = 48) =>
  crypto.randomBytes(size).toString("hex");

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");
