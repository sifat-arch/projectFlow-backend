import { z } from "zod";
import { catchAsync } from "../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../utils/AppError";

type RequestPart = "body" | "query" | "params";

export const validateRequest = (
  zodSchema: z.ZodTypeAny,
  part: RequestPart = "body",
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req[part];
    const result = await zodSchema.safeParseAsync(payload);

    if (!result.success) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        result.error.issues[0]?.message ?? "Invalid request",
      );
    }

    if (part === "query") {
      Object.defineProperty(req, "query", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: result.data,
      });
    } else if (part === "params") {
      Object.assign(req.params, result.data);
    } else {
      req.body = result.data;
    }
    next();
  });
};
