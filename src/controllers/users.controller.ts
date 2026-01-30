import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser
} from "../services/users.service";

export const list = async (_req: Request, res: Response) => {
  const users = await listUsers();
  res.json({ items: users });
};

export const get = async (req: Request, res: Response) => {
  const user = await getUser(req.validated.params.id);
  res.json(user);
};

export const create = async (req: Request, res: Response) => {
  const user = await createUser(req.validated.body);
  res.status(201).json(user);
};

export const update = async (req: Request, res: Response) => {
  const user = await updateUser(req.validated.params.id, req.validated.body);
  res.json(user);
};

export const remove = async (req: Request, res: Response) => {
  await deleteUser(req.validated.params.id);
  res.status(204).send();
};
