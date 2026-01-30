import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : "INTERNAL_SERVER_ERROR";

  logger.error("request_failed", {
    requestId: req.requestId,
    code,
    message: err.message,
    stack: err.stack
  });

  res.status(statusCode).json({
    error: {
      code,
      message: err.message,
      details: err instanceof AppError ? err.details : undefined
    }
  });
};
