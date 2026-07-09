import { Response } from "express";

export function sendData<T>(res: Response, data: T, meta?: Record<string, unknown>) {
  return res.json(meta ? { data, meta } : { data });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  details?: Record<string, unknown>
) {
  return res.status(statusCode).json({
    error: {
      message,
      ...(details ? { details } : {})
    }
  });
}
