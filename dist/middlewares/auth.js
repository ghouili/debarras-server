"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const error_handler_1 = require("./error-handler");
const authMiddleware = (roles) => {
    return (req, _res, next) => {
        const header = req.header("authorization");
        if (!header) {
            return next(new error_handler_1.AppError(401, "UNAUTHORIZED", "Missing token"));
        }
        const [scheme, token] = header.split(" ");
        if (scheme !== "Bearer" || !token) {
            return next(new error_handler_1.AppError(401, "UNAUTHORIZED", "Invalid token"));
        }
        try {
            const payload = (0, jwt_1.verifyAccessToken)(token);
            req.user = { id: payload.sub, role: payload.role };
            if (roles && !roles.includes(req.user.role)) {
                return next(new error_handler_1.AppError(403, "FORBIDDEN", "Insufficient role"));
            }
            return next();
        }
        catch (error) {
            return next(new error_handler_1.AppError(401, "UNAUTHORIZED", "Invalid token"));
        }
    };
};
exports.authMiddleware = authMiddleware;
