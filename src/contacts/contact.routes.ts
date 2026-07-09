import { Router } from "express";
import {
  getContact,
  getContactStats,
  listContacts,
  listFavoriteContacts,
  markContactFavorite,
  removeContactFavorite,
  toggleContactFavorite,
  updateContactNote
} from "./contact.controller";

export const contactRouter = Router();

contactRouter.get("/favorites", listFavoriteContacts);
contactRouter.get("/stats", getContactStats);
contactRouter.get("/", listContacts);
contactRouter.post("/:id/favorite", markContactFavorite);
contactRouter.delete("/:id/favorite", removeContactFavorite);
contactRouter.patch("/:id/favorite", toggleContactFavorite);
contactRouter.put("/:id/note", updateContactNote);
contactRouter.get("/:id", getContact);
