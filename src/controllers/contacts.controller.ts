import { Request, Response } from "express";
import {
  createContact,
  deleteContact,
  getContact,
  listContacts,
  updateContact
} from "../services/contacts.service";

export const list = async (req: Request, res: Response) => {
  const result = await listContacts(req.query as Record<string, string>);
  res.json(result);
};

export const get = async (req: Request, res: Response) => {
  const contact = await getContact(req.validated.params.id);
  res.json(contact);
};

export const create = async (req: Request, res: Response) => {
  const contact = await createContact(req.validated.body);
  res.status(201).json(contact);
};

export const update = async (req: Request, res: Response) => {
  const contact = await updateContact(req.validated.params.id, req.validated.body);
  res.json(contact);
};

export const remove = async (req: Request, res: Response) => {
  await deleteContact(req.validated.params.id);
  res.status(204).send();
};
