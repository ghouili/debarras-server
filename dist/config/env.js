"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmailVerificationRequired = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("4000"),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(1),
    JWT_REFRESH_SECRET: zod_1.z.string().min(1),
    JWT_ACCESS_TTL: zod_1.z.string().default("15m"),
    JWT_REFRESH_TTL: zod_1.z.string().default("30d"),
    REQUIRE_EMAIL_VERIFICATION: zod_1.z.string().optional().default("false"),
    CORS_ORIGIN: zod_1.z.string().optional().default("*"),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    SMTP_FROM: zod_1.z.string().optional(),
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().optional().default("900000"),
    RATE_LIMIT_MAX: zod_1.z.string().optional().default("100"),
    RATE_LIMIT_AUTH_MAX: zod_1.z.string().optional().default("10")
});
exports.env = envSchema.parse(process.env);
exports.isEmailVerificationRequired = exports.env.REQUIRE_EMAIL_VERIFICATION === "true";
