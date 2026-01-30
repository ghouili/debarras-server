import { z } from "zod";

export const devisCreateSchema = z.object({
  body: z.object({
    source: z.string().min(1),
    service: z.string().min(1),
    postalCode: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    timing: z.string().optional().nullable(),
    localType: z.string().optional().nullable(),
    propertyType: z.string().optional().nullable(),
    rooms: z.string().optional().nullable(),
    volume: z.string().optional().nullable(),
    volumeEstimate: z.string().optional().nullable(),
    floor: z.string().optional().nullable(),
    elevator: z.boolean().optional().nullable(),
    truckAccess: z.boolean().optional().nullable(),
    surfaceArea: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    consent: z.boolean(),
    status: z.enum(["new", "quoted", "won", "lost"]).optional()
  })
});

export const devisUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    source: z.string().optional(),
    service: z.string().optional(),
    postalCode: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    timing: z.string().optional().nullable(),
    localType: z.string().optional().nullable(),
    propertyType: z.string().optional().nullable(),
    rooms: z.string().optional().nullable(),
    volume: z.string().optional().nullable(),
    volumeEstimate: z.string().optional().nullable(),
    floor: z.string().optional().nullable(),
    elevator: z.boolean().optional().nullable(),
    truckAccess: z.boolean().optional().nullable(),
    surfaceArea: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    consent: z.boolean().optional(),
    status: z.enum(["new", "quoted", "won", "lost"]).optional()
  })
});

export const devisIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
