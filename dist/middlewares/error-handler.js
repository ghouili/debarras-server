"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../config/logger");
class AppError extends Error {
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const code = err instanceof AppError ? err.code : "INTERNAL_SERVER_ERROR";
    logger_1.logger.error("request_failed", {
        requestId: req.requestId,
        code,
        message: err.message,
        stack: err.stack
    });
    res.status(statusCode).json({
        error: {
            code,
            message: err.message,
            details: err instanceof AppError ? err.details : undefined
        }
    });
};
exports.errorHandler = errorHandler;
