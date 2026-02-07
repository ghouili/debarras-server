"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const openapi_1 = require("./config/openapi");
const error_handler_1 = require("./middlewares/error-handler");
const rate_limit_1 = require("./middlewares/rate-limit");
const request_id_1 = require("./middlewares/request-id");
const logger_1 = require("./config/logger");
const app = (0, express_1.default)();
app.use(request_id_1.requestIdMiddleware);
app.use((0, helmet_1.default)());
// const corsOrigins = env.CORS_ORIGIN === "*" 
// 	? "*" 
// 	: env.CORS_ORIGIN.split(",").map(origin => origin.trim());
const corsOrigins = env_1.env.CORS_ORIGIN === "*"
    ? "*"
    : env_1.env.CORS_ORIGIN
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
// const allowlist =
// 	env.CORS_ORIGIN === "*"
// 		? null
// 		: env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
app.use((0, cors_1.default)({
    origin: corsOrigins === "*" ? true : corsOrigins,
    credentials: true
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("combined"));
app.use(rate_limit_1.defaultRateLimiter);
app.set('trust proxy', 1);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_1.openapiSpec));
app.use("/api", routes_1.default);
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(error_handler_1.errorHandler);
logger_1.logger.info("app_initialized");
exports.default = app;
