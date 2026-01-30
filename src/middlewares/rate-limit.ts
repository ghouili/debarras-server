import rateLimit from "express-rate-limit";
import { env } from "../config/env";

export const defaultRateLimiter = rateLimit({
  windowMs: Number(env.RATE_LIMIT_WINDOW_MS),
  limit: Number(env.RATE_LIMIT_MAX),
  standardHeaders: true,
  legacyHeaders: false
});

export const authRateLimiter = rateLimit({
  windowMs: Number(env.RATE_LIMIT_WINDOW_MS),
  limit: Number(env.RATE_LIMIT_AUTH_MAX),
  standardHeaders: true,
  legacyHeaders: false
});
