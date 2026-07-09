import { z } from "zod";

export const updateContactNoteSchema = z.object({
  personal_note: z
    .string()
    .trim()
    .max(5000, "Personal note must be 5,000 characters or fewer")
    .nullable()
});
