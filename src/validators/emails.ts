import { z } from "zod";

export const emailCreateSchema = z.object({
  body: z.object({
    to: z.string().email(),
    from: z.string().email().optional(),
    subject: z.string().min(1),
    text: z.string().optional().nullable(),
    html: z.string().optional().nullable(),
    relatedContactId: z.string().uuid().optional().nullable(),
    relatedDevisId: z.string().uuid().optional().nullable()
  })
});

export const emailUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    status: z.enum(["queued", "sent", "failed"]).optional()
  })
});

export const emailIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
