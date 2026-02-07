"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRequestId = void 0;
const uuid_1 = require("uuid");
const buildRequestId = () => (0, uuid_1.v4)();
exports.buildRequestId = buildRequestId;
