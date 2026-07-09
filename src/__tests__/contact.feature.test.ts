import request = require("supertest");
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app";
import { Contact } from "../contacts/contact.model";

const accountId = "account_test";

async function createContact(overrides: Partial<{
  account_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_favorite: boolean;
  personal_note: string | null;
}> = {}) {
  return Contact.create({
    account_id: accountId,
    first_name: "Jane",
    last_name: "Doe",
    email: `jane-${Date.now()}-${Math.random()}@example.com`,
    ...overrides
  });
}

describe("Contact API", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
  });

  it("marks a contact as favorite", async () => {
    const contact = await createContact({ is_favorite: false });

    const response = await request(app)
      .post(`/api/contacts/${contact._id.toString()}/favorite`)
      .set("x-account-id", accountId)
      .expect(200);

    expect(response.body.data).toMatchObject({
      id: contact._id.toString(),
      is_favorite: true,
      personal_note: null
    });

    await expect(Contact.findById(contact._id).lean()).resolves.toMatchObject({
      is_favorite: true
    });
  });

  it("updates a personal note", async () => {
    const contact = await createContact();
    const personalNote = "Met during the product discovery call.";

    const response = await request(app)
      .put(`/api/contacts/${contact._id.toString()}/note`)
      .set("x-account-id", accountId)
      .send({ personal_note: personalNote })
      .expect(200);

    expect(response.body.data).toMatchObject({
      id: contact._id.toString(),
      personal_note: personalNote
    });
  });

  it("filters contacts using favorite=1", async () => {
    await createContact({
      first_name: "Alice",
      email: "alice@example.com",
      is_favorite: true
    });
    await createContact({
      first_name: "Bob",
      email: "bob@example.com",
      is_favorite: false
    });

    const response = await request(app)
      .get("/api/contacts?favorite=1")
      .set("x-account-id", accountId)
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      first_name: "Alice",
      is_favorite: true
    });
    expect(response.body.meta).toMatchObject({
      current_page: 1,
      total_items: 1
    });
  });

  it("keeps statistics scoped to the authenticated account", async () => {
    await createContact({ is_favorite: true, personal_note: "Important" });
    await createContact({ is_favorite: false, personal_note: null });
    await createContact({
      account_id: "other_account",
      is_favorite: true,
      personal_note: "Should not count"
    });

    const response = await request(app)
      .get("/api/contacts/stats")
      .set("x-account-id", accountId)
      .expect(200);

    expect(response.body.data).toEqual({
      total_contacts: 2,
      favorite_contacts: 1,
      contacts_with_notes: 1
    });
  });
});
