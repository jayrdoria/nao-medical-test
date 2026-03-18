# Architecture Notes

## Data Model

Three Mongoose models:
- **User** — email + bcrypt password hash
- **Document** — Tiptap JSON stored in `content` field (ProseMirror-compatible)
- **DocumentShare** — join table with a unique compound index on `(documentId, sharedWithId)` to prevent duplicate shares

## Auth

Auth.js v5 with the Credentials provider. Sessions are JWT-based (no DB session table). The JWT callback injects `id` into the token so we can use `session.user.id` in API routes without a DB lookup.

## API Design

All routes are Next.js App Router Route Handlers. Access control:
- Ownership check on mutations (PATCH, DELETE)
- READ access: owner OR any DocumentShare entry pointing to the requesting user
- Shared users can edit content (view-only roles were deliberately skipped — noted below)

## Editor

Tiptap v2 with StarterKit + Underline extension. Content is serialized as ProseMirror JSON and stored directly in MongoDB's `content` field. The editor debounces saves by 1.5s to avoid excessive PATCH requests.

## File Upload

Next.js native `Request.formData()` — no extra deps. Files are parsed as plain text and each non-empty line becomes a Tiptap paragraph node.

## Deliberate Trade-offs

| Decision | Reason |
|----------|--------|
| No real-time collaboration | Requires WebSocket infra (Socket.io/Liveblocks) — out of scope |
| Shared users can edit | Simplifies access control; view-only roles add significant complexity for this timebox |
| No .docx support | mammoth.js adds complexity; .txt and .md cover the intent |
| Seeded users only | Removes need for email service and registration UI |
| JWT sessions | Avoids a session DB table; sufficient for this scope |
