"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = void 0;
const request_id_1 = require("../utils/request-id");
const requestIdMiddleware = (req, res, next) => {
    const requestId = req.header("x-request-id") ?? (0, request_id_1.buildRequestId)();
    req.requestId = requestId;
    res.setHeader("x-request-id", requestId);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
