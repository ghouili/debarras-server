"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailIdSchema = exports.emailUpdateSchema = exports.emailCreateSchema = void 0;
const zod_1 = require("zod");
exports.emailCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        to: zod_1.z.string().email(),
        from: zod_1.z.string().email().optional(),
        subject: zod_1.z.string().min(1),
        text: zod_1.z.string().optional().nullable(),
        html: zod_1.z.string().optional().nullable(),
        relatedContactId: zod_1.z.string().uuid().optional().nullable(),
        relatedDevisId: zod_1.z.string().uuid().optional().nullable()
    })
});
exports.emailUpdateSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["queued", "sent", "failed"]).optional()
    })
});
exports.emailIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
