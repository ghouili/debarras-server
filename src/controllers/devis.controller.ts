import { Request, Response } from "express";
import {
  createDevis,
  deleteDevis,
  getDevis,
  listDevis,
  updateDevis,
  updateDevisStatus
} from "../services/devis.service";

export const list = async (req: Request, res: Response) => {
  const result = await listDevis(req.query as Record<string, string>);
  res.json(result);
};

export const get = async (req: Request, res: Response) => {
  const devis = await getDevis(req.validated.params.id);
  res.json(devis);
};

export const create = async (req: Request, res: Response) => {
  const devis = await createDevis(req.validated.body);
  res.status(201).json(devis);
};

export const update = async (req: Request, res: Response) => {
  const devis = await updateDevis(req.validated.params.id, req.validated.body);
  res.json(devis);
};

export const updateStatus = async (req: Request, res: Response) => {
  const devis = await updateDevisStatus(req.validated.params.id, req.validated.body.status);
  res.json(devis);
};

export const remove = async (req: Request, res: Response) => {
  await deleteDevis(req.validated.params.id);
  res.status(204).send();
};
