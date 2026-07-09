import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

declare global {
  namespace Express {
    interface Request {
      auth: {
        accountId: string;
      };
    }
  }
}

export function attachMockAuth(req: Request, _res: Response, next: NextFunction) {
  req.auth = {
    accountId: req.header("x-account-id") ?? env.MOCK_ACCOUNT_ID
  };

  next();
}
