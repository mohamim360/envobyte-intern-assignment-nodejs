import { RequestHandler } from "express";
import { sendData } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";
import { presentContact, presentContacts } from "./contact.presenter";
import { contactService } from "./contact.service";

export const listFavoriteContacts: RequestHandler = asyncHandler(async (req, res) => {
  const contacts = await contactService.listFavorites(req.auth.accountId);
  return sendData(res, presentContacts(contacts));
});

export const markContactFavorite: RequestHandler = asyncHandler(async (req, res) => {
  const contact = await contactService.setFavorite(req.auth.accountId, req.params.id, true);
  return sendData(res, presentContact(contact));
});

export const removeContactFavorite: RequestHandler = asyncHandler(async (req, res) => {
  const contact = await contactService.setFavorite(req.auth.accountId, req.params.id, false);
  return sendData(res, presentContact(contact));
});

export const toggleContactFavorite: RequestHandler = asyncHandler(async (req, res) => {
  const contact = await contactService.toggleFavorite(req.auth.accountId, req.params.id);
  return sendData(res, presentContact(contact));
});
