import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("30d"),
  REQUIRE_EMAIL_VERIFICATION: z.string().optional().default("false"),
  CORS_ORIGIN: z.string().optional().default("*"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().optional().default("900000"),
  RATE_LIMIT_MAX: z.string().optional().default("100"),
  RATE_LIMIT_AUTH_MAX: z.string().optional().default("10")
});

export const env = envSchema.parse(process.env);

export const isEmailVerificationRequired = env.REQUIRE_EMAIL_VERIFICATION === "true";
