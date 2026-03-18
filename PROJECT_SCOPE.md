# Ajaia AI-Native Full Stack Developer Challenge
## Project Scope & Implementation Plan

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Fast routing, server actions, API routes in one project |
| Language | TypeScript 5.x (strict) | Required for quality signal |
| Styling | Tailwind CSS 4.x + shadcn/ui | Fast, consistent, accessible UI |
| Rich Text Editor | Tiptap v2 | Headless, React-first, serializes to JSON |
| Database | MongoDB (Mongoose) | Familiar stack, flexible document schema |
| Auth | Auth.js v5 (credentials) | Seeded users, no email service needed |
| File Upload | Next.js API route + formidable | Parse .txt / .md into new documents |
| Testing | Vitest + React Testing Library | At least one meaningful test |
| Deployment | Not required for submission | Local Docker Compose optional |

---

## Folder Structure

```
ajaia-docs/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx               # Login page
│   ├── (app)/
│   │   ├── layout.tsx                 # App shell with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx               # My Docs + Shared with me
│   │   └── documents/
│   │       └── [id]/
│   │           └── page.tsx           # Document editor
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts           # Auth.js handler
│   │   ├── documents/
│   │   │   ├── route.ts               # GET list, POST create
│   │   │   └── [id]/
│   │   │       ├── route.ts           # GET, PATCH, DELETE
│   │   │       └── share/
│   │   │           └── route.ts       # POST share with user
│   │   └── upload/
│   │       └── route.ts               # POST file upload
│   └── layout.tsx                     # Root layout
├── components/
│   ├── editor/
│   │   ├── Editor.tsx                 # Tiptap editor wrapper
│   │   └── Toolbar.tsx                # Bold, italic, headings, lists
│   ├── documents/
│   │   ├── DocumentCard.tsx           # Card for dashboard list
│   │   ├── ShareModal.tsx             # Share by email modal
│   │   └── UploadModal.tsx            # File upload modal
│   └── ui/                            # shadcn/ui components
├── lib/
│   ├── auth.ts                        # Auth.js config
│   ├── db.ts                          # Mongoose connection
│   ├── validations.ts                 # Zod schemas
│   └── utils.ts                       # cn() and helpers
├── models/
│   ├── User.ts                        # User schema
│   ├── Document.ts                    # Document schema
│   └── DocumentShare.ts               # Share schema
├── scripts/
│   └── seed.ts                        # Seed 3 test users
├── __tests__/
│   └── documents.api.test.ts          # API route unit test
├── .env.local                         # Secrets (not committed)
├── .env.example                       # Template for reviewers
├── README.md
├── ARCHITECTURE.md
├── AI_WORKFLOW.md
└── SUBMISSION.md
```

---

## MongoDB Schemas

### User
```ts
{
  _id: ObjectId,
  name: string,
  email: string,          // unique
  passwordHash: string,
  createdAt: Date
}
```

### Document
```ts
{
  _id: ObjectId,
  title: string,
  content: object,        // Tiptap JSON (ProseMirror)
  ownerId: ObjectId,      // ref: User
  createdAt: Date,
  updatedAt: Date
}
```

### DocumentShare
```ts
{
  _id: ObjectId,
  documentId: ObjectId,   // ref: Document
  sharedWithId: ObjectId, // ref: User
  createdAt: Date
}
```

---

## Features & Scope

### 1. Auth (Credentials)
- Login with email + password
- Session via Auth.js JWT
- 3 seeded users: `alice@ajaia.dev`, `bob@ajaia.dev`, `carol@ajaia.dev` (password: `password123`)
- Protected routes via middleware

### 2. Dashboard
- "My Documents" — docs owned by current user
- "Shared with Me" — docs shared via DocumentShare
- Create new document button
- Upload file button (.txt and .md only — stated clearly in UI)
- Rename inline or via document menu
- Delete owned documents

### 3. Document Editor
- Full-page Tiptap editor
- Toolbar: Bold, Italic, Underline, H1/H2/H3, Bullet list, Ordered list
- Auto-save on change (debounced 1.5s) via PATCH API
- Title editable inline at top
- Share button → opens ShareModal
- Back to dashboard button

### 4. File Upload
- Accepts `.txt` and `.md` only (enforced client + server)
- Parses file content as plain text
- Creates a new Document with filename as title and content wrapped in a Tiptap paragraph node
- Redirects to editor on success

### 5. Sharing
- Owner clicks Share → types email of another user
- Server looks up user by email → creates DocumentShare record
- Shared user sees document in "Shared with Me" section
- Shared docs show owner name as a badge
- Shared users can view and edit content (intentional — keeps scope simple, noted in architecture)
- Owner cannot share with themselves (validated)

### 6. Persistence
- All documents saved to MongoDB
- Tiptap JSON stored as-is in content field
- Shared access persists across sessions
- Auto-save ensures no lost work on navigation

---

## Deliberate Scope Cuts

| Feature | Decision | Reason |
|---|---|---|
| Real-time collaboration | Skipped | Requires WebSocket infra (Socket.io or Liveblocks), out of scope |
| .docx upload parsing | Skipped | mammoth.js adds complexity; .txt and .md cover the intent cleanly |
| Role-based permissions (view vs edit) | Skipped | Overly complex for this timebox; noted in architecture |
| Email-based auth | Skipped | Seeded credentials keeps reviewer setup to zero |
| Version history | Skipped | Stretch only |
| Export to PDF/Markdown | Skipped | Stretch only |
| User registration UI | Skipped | Seeded accounts are sufficient for demo |

---

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/documents` | Required | List owned + shared documents |
| POST | `/api/documents` | Required | Create new document |
| GET | `/api/documents/[id]` | Required | Get single document (owner or shared) |
| PATCH | `/api/documents/[id]` | Required | Update title or content |
| DELETE | `/api/documents/[id]` | Required | Delete document (owner only) |
| POST | `/api/documents/[id]/share` | Required | Share with user by email |
| POST | `/api/upload` | Required | Upload .txt/.md → create document |

All routes return `{ error: string }` with appropriate HTTP status on failure.

---

## Test Coverage

**File:** `__tests__/documents.api.test.ts`

Tests covered:
- `POST /api/documents` — creates document, returns 201
- `GET /api/documents/[id]` — returns 403 if not owner or shared user
- `POST /api/documents/[id]/share` — validates email exists, prevents duplicate shares

---

## Seeded Users

| Name | Email | Password |
|---|---|---|
| Alice | alice@ajaia.dev | password123 |
| Bob | bob@ajaia.dev | password123 |
| Carol | carol@ajaia.dev | password123 |

Login as Alice → create/edit docs → share with Bob → login as Bob → verify "Shared with Me".

---

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/ajaia-docs
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

---

## Build Order (Implementation Sequence)

1. `npx create-next-app` + install deps
2. MongoDB connection + Mongoose models
3. Auth.js credentials setup + seed script
4. Dashboard UI + document list API
5. Tiptap editor + auto-save
6. File upload route + modal
7. Share modal + share API
8. Error handling pass + Zod validation
9. One automated test
10. README + ARCHITECTURE + AI_WORKFLOW + SUBMISSION docs

---

## Deliverables Checklist

- [ ] Source code (GitHub repo or zip)
- [ ] `README.md` — local setup and run instructions
- [ ] `ARCHITECTURE.md` — decisions and tradeoffs
- [ ] `AI_WORKFLOW.md` — AI tool usage notes
- [ ] `SUBMISSION.md` — index of all included materials
- [ ] `video_link.txt` — unlisted Loom or YouTube URL
- [ ] `.env.example` — environment variable template
- [ ] Seeded user credentials documented
