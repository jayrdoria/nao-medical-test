# Submission Index

## Included Materials

| File | Description |
|------|-------------|
| `README.md` | Setup and run instructions |
| `ARCHITECTURE.md` | Technical decisions and trade-offs |
| `AI_WORKFLOW.md` | AI tool usage notes |
| `SUBMISSION.md` | This file |
| `.env.example` | Environment variable template |
| `docker-compose.yml` | Docker Compose for one-command startup |
| `__tests__/documents.api.test.ts` | API route tests |

## Seeded Accounts

| Email | Password |
|-------|----------|
| alice@ajaia.dev | password123 |
| bob@ajaia.dev | password123 |
| carol@ajaia.dev | password123 |

## How to Run

```bash
docker compose up --build
```

Open http://localhost:3000

## Test Flow

1. Login as Alice
2. Create a document, write some content
3. Click Share → enter `bob@ajaia.dev`
4. Log out, login as Bob
5. Check "Shared with Me" on the dashboard
6. Edit the shared document
