import { NextFunction, Request, Response } from "express";
import { buildRequestId } from "../utils/request-id";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.header("x-request-id") ?? buildRequestId();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
};
