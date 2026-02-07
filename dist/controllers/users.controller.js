"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.get = exports.list = void 0;
const users_service_1 = require("../services/users.service");
const list = async (_req, res) => {
    const users = await (0, users_service_1.listUsers)();
    res.json({ items: users });
};
exports.list = list;
const get = async (req, res) => {
    const user = await (0, users_service_1.getUser)(req.validated.params.id);
    res.json(user);
};
exports.get = get;
const create = async (req, res) => {
    const user = await (0, users_service_1.createUser)(req.validated.body);
    res.status(201).json(user);
};
exports.create = create;
const update = async (req, res) => {
    const user = await (0, users_service_1.updateUser)(req.validated.params.id, req.validated.body);
    res.json(user);
};
exports.update = update;
const remove = async (req, res) => {
    await (0, users_service_1.deleteUser)(req.validated.params.id);
    res.status(204).send();
};
exports.remove = remove;
