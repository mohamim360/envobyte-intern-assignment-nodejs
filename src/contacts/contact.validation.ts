import { z } from "zod";

export const updateContactNoteSchema = z.object({
  personal_note: z
    .string()
    .trim()
    .max(5000, "Personal note must be 5,000 characters or fewer")
    .nullable()
});

export const listContactsQuerySchema = z.object({
  favorite: z
    .enum(["1", "true"])
    .optional()
    .transform((value) => value === "1" || value === "true"),
  search: z.string().trim().min(1).max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(15)
});
