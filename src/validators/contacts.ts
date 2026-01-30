import { z } from "zod";

export const contactCreateSchema = z.object({
  body: z.object({
    source: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    postalCode: z.string().optional().nullable(),
    message: z.string().min(1),
    consent: z.boolean(),
    status: z.enum(["new", "in_progress", "closed"]).optional()
  })
});

export const contactUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    source: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    postalCode: z.string().optional().nullable(),
    message: z.string().optional(),
    consent: z.boolean().optional(),
    status: z.enum(["new", "in_progress", "closed"]).optional()
  })
});

export const contactIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
