import { z } from "zod";

export const userCreateSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    role: z.enum(["admin", "agent", "viewer"]).optional(),
    password: z.string().min(8)
  })
});

export const userUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional().nullable(),
    role: z.enum(["admin", "agent", "viewer"]).optional(),
    isActive: z.boolean().optional()
  })
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
