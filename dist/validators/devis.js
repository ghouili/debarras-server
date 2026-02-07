"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devisIdSchema = exports.devisStatusUpdateSchema = exports.devisUpdateSchema = exports.devisCreateSchema = void 0;
const zod_1 = require("zod");
exports.devisCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        source: zod_1.z.string().min(1),
        service: zod_1.z.string().min(1),
        postalCode: zod_1.z.string().optional().nullable(),
        city: zod_1.z.string().optional().nullable(),
        timing: zod_1.z.string().optional().nullable(),
        localType: zod_1.z.string().optional().nullable(),
        propertyType: zod_1.z.string().optional().nullable(),
        rooms: zod_1.z.string().optional().nullable(),
        volume: zod_1.z.string().optional().nullable(),
        volumeEstimate: zod_1.z.string().optional().nullable(),
        floor: zod_1.z.string().optional().nullable(),
        elevator: zod_1.z.boolean().optional().nullable(),
        truckAccess: zod_1.z.boolean().optional().nullable(),
        surfaceArea: zod_1.z.string().optional().nullable(),
        message: zod_1.z.string().optional().nullable(),
        fullName: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(1),
        consent: zod_1.z.boolean(),
        status: zod_1.z.enum(["nouveau", "traite", "gagne", "perdu"]).optional()
    })
});
exports.devisUpdateSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        source: zod_1.z.string().optional(),
        service: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional().nullable(),
        city: zod_1.z.string().optional().nullable(),
        timing: zod_1.z.string().optional().nullable(),
        localType: zod_1.z.string().optional().nullable(),
        propertyType: zod_1.z.string().optional().nullable(),
        rooms: zod_1.z.string().optional().nullable(),
        volume: zod_1.z.string().optional().nullable(),
        volumeEstimate: zod_1.z.string().optional().nullable(),
        floor: zod_1.z.string().optional().nullable(),
        elevator: zod_1.z.boolean().optional().nullable(),
        truckAccess: zod_1.z.boolean().optional().nullable(),
        surfaceArea: zod_1.z.string().optional().nullable(),
        message: zod_1.z.string().optional().nullable(),
        fullName: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        consent: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(["nouveau", "traite", "gagne", "perdu"]).optional()
    })
});
exports.devisStatusUpdateSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["nouveau", "traite", "gagne", "perdu"])
    })
});
exports.devisIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
