"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.updateStatus = exports.update = exports.create = exports.get = exports.list = void 0;
const contacts_service_1 = require("../services/contacts.service");
const list = async (req, res) => {
    const result = await (0, contacts_service_1.listContacts)(req.query);
    res.json(result);
};
exports.list = list;
const get = async (req, res) => {
    const contact = await (0, contacts_service_1.getContact)(req.validated.params.id);
    res.json(contact);
};
exports.get = get;
const create = async (req, res) => {
    console.log("[contacts.create] payload", req.validated?.body, req.body);
    const contact = await (0, contacts_service_1.createContact)(req.validated.body);
    res.status(201).json(contact);
};
exports.create = create;
const update = async (req, res) => {
    const contact = await (0, contacts_service_1.updateContact)(req.validated.params.id, req.validated.body);
    res.json(contact);
};
exports.update = update;
const updateStatus = async (req, res) => {
    const contact = await (0, contacts_service_1.updateContactStatus)(req.validated.params.id, req.validated.body.status);
    res.json(contact);
};
exports.updateStatus = updateStatus;
const remove = async (req, res) => {
    await (0, contacts_service_1.deleteContact)(req.validated.params.id);
    res.status(204).send();
};
exports.remove = remove;
