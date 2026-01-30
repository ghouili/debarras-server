import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "./error-handler";

export type Role = "admin" | "agent" | "viewer";

export const authMiddleware = (roles?: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.header("authorization");
    if (!header) {
      return next(new AppError(401, "UNAUTHORIZED", "Missing token"));
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return next(new AppError(401, "UNAUTHORIZED", "Invalid token"));
    }

    try {
      const payload = verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role as Role };
      if (roles && !roles.includes(req.user.role)) {
        return next(new AppError(403, "FORBIDDEN", "Insufficient role"));
      }
      return next();
    } catch (error) {
      return next(new AppError(401, "UNAUTHORIZED", "Invalid token"));
    }
  };
};
