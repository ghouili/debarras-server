import { Request, Response } from "express";
import {
  changePassword,
  createPasswordReset,
  issueTokens,
  loginUser,
  registerUser,
  resetPassword,
  revokeRefreshToken,
  rotateRefreshToken
} from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password } = req.validated.body;
  const user = await registerUser({ firstName, lastName, email, phone, password });
  const tokens = await issueTokens(user.id, user.role);

  res.status(201).json({ user, ...tokens });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.validated.body;
  const user = await loginUser(email, password);
  const tokens = await issueTokens(user.id, user.role);
  res.json({ user, ...tokens });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.validated.body;
  const tokens = await rotateRefreshToken(refreshToken);
  res.json(tokens);
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.validated.body;
  await revokeRefreshToken(refreshToken);
  res.status(204).send();
};

export const me = async (req: Request, res: Response) => {
  res.json({ user: req.user });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.validated.body;
  const result = await createPasswordReset(email);
  res.json({ sent: Boolean(result), token: result?.token });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, password } = req.validated.body;
  await resetPassword(token, password);
  res.status(204).send();
};

export const changePasswordController = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.validated.body;
  await changePassword(req.user.id, currentPassword, newPassword);
  res.status(204).send();
};
