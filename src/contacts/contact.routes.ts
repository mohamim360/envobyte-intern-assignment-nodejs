import { Router } from "express";
import {
  getContact,
  listFavoriteContacts,
  markContactFavorite,
  removeContactFavorite,
  toggleContactFavorite,
  updateContactNote
} from "./contact.controller";

export const contactRouter = Router();

contactRouter.get("/favorites", listFavoriteContacts);
contactRouter.post("/:id/favorite", markContactFavorite);
contactRouter.delete("/:id/favorite", removeContactFavorite);
contactRouter.patch("/:id/favorite", toggleContactFavorite);
contactRouter.put("/:id/note", updateContactNote);
contactRouter.get("/:id", getContact);
