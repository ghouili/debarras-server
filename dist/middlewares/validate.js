"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const error_handler_1 = require("./error-handler");
const validate = (schema) => {
    return (req, _res, next) => {
        console.log("[validate]", req.method, req.originalUrl, "body:", req.body);
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });
        if (!result.success) {
            return next(new error_handler_1.AppError(400, "VALIDATION_ERROR", "Invalid request", result.error.flatten()));
        }
        req.validated = result.data;
        return next();
    };
};
exports.validate = validate;
