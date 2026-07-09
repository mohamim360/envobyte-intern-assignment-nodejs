import { RequestHandler } from "express";
import { sendError } from "../shared/api-response";

export const notFoundHandler: RequestHandler = (req, res) => {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};
