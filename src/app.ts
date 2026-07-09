import cors from "cors";
import express from "express";
import helmet from "helmet";
import { contactRouter } from "./contacts/contact.routes";
import { attachMockAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(attachMockAuth);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/contacts", contactRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp();
