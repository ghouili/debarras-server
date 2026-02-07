"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (page, limit) => {
    const pageNumber = Math.max(Number(page ?? 1), 1);
    const take = Math.min(Math.max(Number(limit ?? 20), 1), 100);
    const skip = (pageNumber - 1) * take;
    return { page: pageNumber, limit: take, skip, take };
};
exports.getPagination = getPagination;
