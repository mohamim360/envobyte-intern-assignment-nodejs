import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/monica-contact-extension"),
  MOCK_ACCOUNT_ID: z.string().min(1).default("account_demo")
});

export const env = envSchema.parse(process.env);
