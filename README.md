# Monica Contact Extension API

Node.js, Express, TypeScript, MongoDB, and Mongoose implementation of the Monica contact extension assignment.

It is a standalone assignment project that demonstrates the required API behavior and documents how the same changes would be applied to a larger Monica-style codebase.

## Requirements Covered

- Adds `is_favorite` and `personal_note` fields to contacts.
- Provides favorite, note, single-contact, filtered listing, and statistics endpoints.
- Keeps every query scoped to the authenticated account.
- Preserves pagination and sorting on the contact listing endpoint.
- Uses reusable service/query/presenter layers instead of controller-heavy logic.
- Includes feature tests for the required workflows.

## Setup

Prerequisites:

- Node.js 22 or newer
- npm
- MongoDB, local or hosted

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Start the API:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
npm start
```

## API

All endpoints return a consistent JSON envelope:

```json
{
  "data": {}
}
```

Paginated list responses also include `meta`.

Endpoints:

- `GET /api/contacts`
- `GET /api/contacts?favorite=1`
- `GET /api/contacts?search=john`
- `GET /api/contacts?favorite=1&search=john`
- `GET /api/contacts/favorites`
- `GET /api/contacts/stats`
- `GET /api/contacts/:id`
- `POST /api/contacts/:id/favorite`
- `DELETE /api/contacts/:id/favorite`
- `PATCH /api/contacts/:id/favorite`
- `PUT /api/contacts/:id/note`

Example note payload:

```json
{
  "personal_note": "Met at the conference."
}
```

The demo auth middleware reads `x-account-id`. If it is omitted, `MOCK_ACCOUNT_ID` from `.env` is used.

## Implementation Approach

The project uses a small layered architecture:

- `contact.routes.ts` maps HTTP endpoints.
- `contact.controller.ts` handles request parsing and response envelopes.
- `contact.service.ts` owns account-scoped business logic.
- `contact.query.ts` centralizes reusable search/filter construction.
- `contact.presenter.ts` normalizes API response fields.

## Reference Analysis

The provided reference implementation had useful strengths: it covered the core endpoints, used TypeScript, added account scoping, used MongoDB aggregation for stats, and included basic feature tests.

This implementation improves on it by:

- Moving business logic out of controllers into a service layer.
- Centralizing query building to avoid duplicated listing/filter logic.
- Adding explicit validation with `zod`.
- Returning normalized API responses through presenters.
- Avoiding regex injection by escaping search input.
- Keeping invalid ObjectIds from leaking database errors.
- Preserving account isolation consistently through request auth context.
- Expanding tests to include statistics isolation.

## Design Decisions

- MongoDB/Mongoose were kept because the assignment reference was authorized to use Node.js/MongoDB for this submission.
- `POST /favorite`, `DELETE /favorite`, and `PATCH /favorite` are intentionally all supported because the assignment requires all three.
- `PATCH /favorite` toggles the current value.
- Empty notes are not counted by `/stats`; non-empty notes are counted.
- Offset pagination is used because it is simple, assignment-friendly, and compatible with conventional page metadata.

## Assumptions

- Full Monica authentication is outside this assignment scope, so `x-account-id` simulates an authenticated account.
- Contacts already exist; this project focuses on the required contact extension behavior rather than a full CRUD module.
- The API convention is `{ data, meta? }` for success and `{ error }` for failures.
- For existing MongoDB data, backfill old contacts once with `is_favorite: false` and `personal_note: null`; new documents receive those defaults from the Mongoose schema.

## Limitations and Trade-offs

- This is a standalone implementation, not a drop-in Monica patch.
- The auth middleware is intentionally simple and should be replaced by real authentication in production.
- Offset pagination can become slower on very large collections; cursor pagination would be a future upgrade.
- Text search uses escaped case-insensitive regex for portability. A MongoDB text index would be better for large-scale search.

## Estimated Development Time

Approximately 5 hours:

- Project setup: 30 minutes
- Migration and model work: 40 minutes
- Endpoints and service layer: 1 hour 45 minutes
- Filtering and statistics: 50 minutes
- Tests and documentation: 1 hour

