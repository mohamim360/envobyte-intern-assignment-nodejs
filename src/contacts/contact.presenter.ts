import { HydratedDocument } from "mongoose";
import { ContactDocument } from "./contact.model";

type ContactRecord = HydratedDocument<ContactDocument>;

export function presentContact(contact: ContactRecord) {
  return {
    id: contact._id.toString(),
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    is_favorite: contact.is_favorite,
    personal_note: contact.personal_note,
    account_id: contact.account_id,
    created_at: contact.createdAt,
    updated_at: contact.updatedAt
  };
}

export function presentContacts(contacts: ContactRecord[]) {
  return contacts.map(presentContact);
}
