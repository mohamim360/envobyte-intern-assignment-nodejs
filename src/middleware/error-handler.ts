import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../shared/api-error";
import { sendError } from "../shared/api-response";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return sendError(res, 422, "Validation failed", {
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof ApiError) {
    return sendError(res, error.statusCode, error.message);
  }

  console.error(error);
  return sendError(res, 500, "Internal server error");
};
