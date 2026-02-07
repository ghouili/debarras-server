"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.userUpdateSchema = exports.userCreateSchema = void 0;
const zod_1 = require("zod");
exports.userCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(1),
        lastName: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().optional().nullable(),
        role: zod_1.z.enum(["admin", "agent", "viewer"]).optional(),
        password: zod_1.z.string().min(8)
    })
});
exports.userUpdateSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional().nullable(),
        role: zod_1.z.enum(["admin", "agent", "viewer"]).optional(),
        isActive: zod_1.z.boolean().optional()
    })
});
exports.userIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
