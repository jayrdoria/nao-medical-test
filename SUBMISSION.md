# Submission — Ajaia AI-Native Full Stack Developer Challenge

## Candidate
Jay Doria

## GitHub Repository
https://github.com/jayrdoria/nao-medical-test

---

## Included Materials

| File / Folder | Description |
|---|---|
| `README.md` | Local setup, Docker instructions, test accounts |
| `ARCHITECTURE.md` | Technical decisions and trade-offs |
| `AI_WORKFLOW.md` | How AI was used throughout the project |
| `SUBMISSION.md` | This file |
| `.env.example` | Environment variable template |
| `docker-compose.yml` | One-command Docker startup |
| `Dockerfile` | Multi-stage production build |
| `__tests__/documents.api.test.ts` | API route unit tests |
| `video_link.txt` | Unlisted walkthrough video URL |

---

## How to Run (Docker — recommended)

```bash
git clone https://github.com/jayrdoria/nao-medical-test.git
cd nao-medical-test
docker compose up --build
```

Open http://localhost:3000

Seeded users are created automatically on first startup.

---

## Test Accounts

| Name  | Email           | Password    |
|-------|-----------------|-------------|
| Alice | alice@ajaia.dev | password123 |
| Bob   | bob@ajaia.dev   | password123 |
| Carol | carol@ajaia.dev | password123 |

---

## End-to-End Test Flow

1. Open http://localhost:3000 — redirects to `/login`
2. Login as **Alice** (`alice@ajaia.dev` / `password123`)
3. Click **New Document** → write content using the rich text toolbar
4. Edit the document title inline
5. Click **Share** → enter `bob@ajaia.dev` → confirm
6. The Share modal shows Bob listed under "Shared with"
7. Sign out → login as **Bob**
8. Dashboard shows Alice's doc under **Shared with Me**
9. Bob can open and edit the shared document
10. Click **Upload** → drag & drop or select a `.txt` or `.md` file → redirects to editor
11. Back on dashboard → rename a doc via the `⋯` menu → delete a doc

---

## What Works End to End

- Credentials auth with JWT sessions
- Dashboard: My Documents + Shared with Me sections
- Rich text editor (Bold, Italic, Underline, H1/H2/H3, Bullet/Ordered lists)
- Auto-save on change (1.5s debounce)
- Inline document title editing
- Document sharing by email with shared-with list in modal
- Drag & drop file upload (.txt and .md)
- Rename and delete documents
- Full Docker Compose setup with Atlas MongoDB

---

## Intentionally Deprioritized

| Feature | Reason |
|---|---|
| Real-time collaboration | Requires WebSocket infra — out of scope |
| View-only share permissions | Adds significant complexity for this timebox |
| .docx upload | mammoth.js complexity not worth it for the scope |
| User registration UI | Seeded accounts cover reviewer needs |
| Version history | Stretch goal only |
| Export to PDF/Markdown | Stretch goal only |

---

## What I'd Build Next (with 2–4 more hours)

1. **Role-based sharing** — view vs. edit permissions per share
2. **Real-time presence indicators** — show who else has the doc open
3. **Version history** — store document snapshots and allow rollback
4. **Search** — full-text search across owned + shared documents
5. **Keyboard shortcuts** — Cmd+S force save, Cmd+K command palette
