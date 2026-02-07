"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactIdSchema = exports.contactStatusUpdateSchema = exports.contactUpdateSchema = exports.contactCreateSchema = void 0;
const zod_1 = require("zod");
exports.contactCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        source: zod_1.z.string().min(1),
        name: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(1),
        postalCode: zod_1.z.string().optional().nullable(),
        message: zod_1.z.string().min(1),
        consent: zod_1.z.boolean(),
        status: zod_1.z.enum(["nouveau", "en_cours", "fermee"]).optional()
    })
});
exports.contactUpdateSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        source: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional().nullable(),
        message: zod_1.z.string().optional(),
        consent: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(["nouveau", "en_cours", "fermee"]).optional()
    })
});
exports.contactStatusUpdateSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["nouveau", "en_cours", "fermee"])
    })
});
exports.contactIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
