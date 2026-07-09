import { isValidObjectId } from "mongoose";
import { ApiError } from "../shared/api-error";
import { Contact } from "./contact.model";
import { buildContactFilter } from "./contact.query";

interface ListContactsInput {
  accountId: string;
  favorite?: boolean;
  search?: string;
  page: number;
  limit: number;
  sortBy: "created_at" | "first_name" | "last_name" | "email";
  sortOrder: "asc" | "desc";
}

function assertValidContactId(contactId: string) {
  if (!isValidObjectId(contactId)) {
    throw ApiError.notFound("Contact not found");
  }
}

export class ContactService {
  async getStats(accountId: string) {
    const [stats] = await Contact.aggregate<{
      total_contacts: number;
      favorite_contacts: number;
      contacts_with_notes: number;
    }>([
      { $match: { account_id: accountId } },
      {
        $group: {
          _id: null,
          total_contacts: { $sum: 1 },
          favorite_contacts: {
            $sum: { $cond: [{ $eq: ["$is_favorite", true] }, 1, 0] }
          },
          contacts_with_notes: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$personal_note", null] },
                    { $ne: ["$personal_note", ""] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total_contacts: 1,
          favorite_contacts: 1,
          contacts_with_notes: 1
        }
      }
    ]).exec();

    return (
      stats ?? {
        total_contacts: 0,
        favorite_contacts: 0,
        contacts_with_notes: 0
      }
    );
  }

  async listContacts(input: ListContactsInput) {
    const filter = buildContactFilter({
      accountId: input.accountId,
      favorite: input.favorite,
      search: input.search
    });
    const skip = (input.page - 1) * input.limit;
    const sortField = input.sortBy === "created_at" ? "createdAt" : input.sortBy;
    const sortDirection = input.sortOrder === "asc" ? 1 : -1;

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ [sortField]: sortDirection, _id: sortDirection })
        .skip(skip)
        .limit(input.limit)
        .exec(),
      Contact.countDocuments(filter).exec()
    ]);

    return {
      contacts,
      pagination: {
        current_page: input.page,
        per_page: input.limit,
        last_page: Math.max(Math.ceil(total / input.limit), 1),
        total_items: total
      }
    };
  }

  async getContact(accountId: string, contactId: string) {
    assertValidContactId(contactId);

    const contact = await Contact.findOne({ _id: contactId, account_id: accountId }).exec();

    if (!contact) {
      throw ApiError.notFound("Contact not found");
    }

    return contact;
  }

  async listFavorites(accountId: string) {
    return Contact.find({ account_id: accountId, is_favorite: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async setFavorite(accountId: string, contactId: string, isFavorite: boolean) {
    assertValidContactId(contactId);

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, account_id: accountId },
      { $set: { is_favorite: isFavorite } },
      { new: true, runValidators: true }
    ).exec();

    if (!contact) {
      throw ApiError.notFound("Contact not found");
    }

    return contact;
  }

  async toggleFavorite(accountId: string, contactId: string) {
    assertValidContactId(contactId);

    const contact = await Contact.findOne({ _id: contactId, account_id: accountId }).exec();

    if (!contact) {
      throw ApiError.notFound("Contact not found");
    }

    contact.is_favorite = !contact.is_favorite;
    return contact.save();
  }

  async updateNote(accountId: string, contactId: string, personalNote: string | null) {
    assertValidContactId(contactId);

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, account_id: accountId },
      { $set: { personal_note: personalNote } },
      { new: true, runValidators: true }
    ).exec();

    if (!contact) {
      throw ApiError.notFound("Contact not found");
    }

    return contact;
  }
}

export const contactService = new ContactService();
