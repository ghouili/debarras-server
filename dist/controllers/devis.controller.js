"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.updateStatus = exports.update = exports.create = exports.get = exports.list = void 0;
const devis_service_1 = require("../services/devis.service");
const list = async (req, res) => {
    const result = await (0, devis_service_1.listDevis)(req.query);
    res.json(result);
};
exports.list = list;
const get = async (req, res) => {
    const devis = await (0, devis_service_1.getDevis)(req.validated.params.id);
    res.json(devis);
};
exports.get = get;
const create = async (req, res) => {
    const devis = await (0, devis_service_1.createDevis)(req.validated.body);
    res.status(201).json(devis);
};
exports.create = create;
const update = async (req, res) => {
    const devis = await (0, devis_service_1.updateDevis)(req.validated.params.id, req.validated.body);
    res.json(devis);
};
exports.update = update;
const updateStatus = async (req, res) => {
    const devis = await (0, devis_service_1.updateDevisStatus)(req.validated.params.id, req.validated.body.status);
    res.json(devis);
};
exports.updateStatus = updateStatus;
const remove = async (req, res) => {
    await (0, devis_service_1.deleteDevis)(req.validated.params.id);
    res.status(204).send();
};
exports.remove = remove;
