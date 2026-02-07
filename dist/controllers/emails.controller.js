"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.get = exports.list = void 0;
const emails_service_1 = require("../services/emails.service");
const list = async (req, res) => {
    const result = await (0, emails_service_1.listEmails)(req.query);
    res.json(result);
};
exports.list = list;
const get = async (req, res) => {
    const email = await (0, emails_service_1.getEmail)(req.validated.params.id);
    res.json(email);
};
exports.get = get;
const create = async (req, res) => {
    const email = await (0, emails_service_1.createEmail)(req.validated.body);
    res.status(201).json(email);
};
exports.create = create;
const update = async (req, res) => {
    const email = await (0, emails_service_1.updateEmail)(req.validated.params.id, req.validated.body);
    res.json(email);
};
exports.update = update;
const remove = async (req, res) => {
    await (0, emails_service_1.deleteEmail)(req.validated.params.id);
    res.status(204).send();
};
exports.remove = remove;
