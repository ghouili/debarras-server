import { Request, Response } from "express";
import {
  createEmail,
  deleteEmail,
  getEmail,
  listEmails,
  updateEmail
} from "../services/emails.service";

export const list = async (req: Request, res: Response) => {
  const result = await listEmails(req.query as Record<string, string>);
  res.json(result);
};

export const get = async (req: Request, res: Response) => {
  const email = await getEmail(req.validated.params.id);
  res.json(email);
};

export const create = async (req: Request, res: Response) => {
  const email = await createEmail(req.validated.body);
  res.status(201).json(email);
};

export const update = async (req: Request, res: Response) => {
  const email = await updateEmail(req.validated.params.id, req.validated.body);
  res.json(email);
};

export const remove = async (req: Request, res: Response) => {
  await deleteEmail(req.validated.params.id);
  res.status(204).send();
};
