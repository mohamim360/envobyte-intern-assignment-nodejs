import { Router } from "express";
import {
  listFavoriteContacts,
  markContactFavorite,
  removeContactFavorite,
  toggleContactFavorite
} from "./contact.controller";

export const contactRouter = Router();

contactRouter.get("/favorites", listFavoriteContacts);
contactRouter.post("/:id/favorite", markContactFavorite);
contactRouter.delete("/:id/favorite", removeContactFavorite);
contactRouter.patch("/:id/favorite", toggleContactFavorite);
