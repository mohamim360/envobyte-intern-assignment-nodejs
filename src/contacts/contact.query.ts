import { FilterQuery } from "mongoose";
import { ContactDocument } from "./contact.model";

export interface ContactListOptions {
  accountId: string;
  favorite?: boolean;
  search?: string;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildContactFilter(options: ContactListOptions): FilterQuery<ContactDocument> {
  const filter: FilterQuery<ContactDocument> = {
    account_id: options.accountId
  };

  if (options.favorite) {
    filter.is_favorite = true;
  }

  if (options.search) {
    const searchPattern = new RegExp(escapeRegex(options.search), "i");
    filter.$or = [
      { first_name: searchPattern },
      { last_name: searchPattern },
      { email: searchPattern }
    ];
  }

  return filter;
}
