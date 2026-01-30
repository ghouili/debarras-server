import nodemailer from "nodemailer";
import { env } from "./env";

export const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT ? Number(env.SMTP_PORT) : 587,
  secure: false,
  auth: env.SMTP_USER
    ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    : undefined
});
