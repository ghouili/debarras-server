"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const getStats = async (_req, res) => {
    const stats = await (0, dashboard_service_1.getDashboardStats)();
    res.json(stats);
};
exports.getStats = getStats;
