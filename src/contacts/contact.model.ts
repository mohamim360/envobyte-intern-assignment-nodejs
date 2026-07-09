import { InferSchemaType, Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    account_id: {
      type: String,
      required: true,
      index: true
    },
    first_name: {
      type: String,
      required: true,
      trim: true
    },
    last_name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    is_favorite: {
      type: Boolean,
      required: true,
      default: false,
      index: true
    },
    personal_note: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

contactSchema.index({ account_id: 1, createdAt: -1 });
contactSchema.index({ account_id: 1, is_favorite: 1, createdAt: -1 });

export type ContactDocument = InferSchemaType<typeof contactSchema>;

export const Contact = model<ContactDocument>("Contact", contactSchema);
