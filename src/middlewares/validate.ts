import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "./error-handler";

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    console.log("[validate]", req.method, req.originalUrl, "body:", req.body);
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return next(new AppError(400, "VALIDATION_ERROR", "Invalid request", result.error.flatten()));
    }

    req.validated = result.data;
    return next();
  };
};
