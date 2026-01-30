import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8)
  .regex(/[a-z]/, "Must include lowercase")
  .regex(/[A-Z]/, "Must include uppercase")
  .regex(/[0-9]/, "Must include number");

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    password: passwordSchema
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1)
  })
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1)
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email()
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: passwordSchema
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema
  })
});
