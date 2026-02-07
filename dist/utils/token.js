"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = exports.generateRandomToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandomToken = (size = 48) => crypto_1.default.randomBytes(size).toString("hex");
exports.generateRandomToken = generateRandomToken;
const hashToken = (token) => crypto_1.default.createHash("sha256").update(token).digest("hex");
exports.hashToken = hashToken;
