# AI Workflow Notes

## How AI was used

Claude Code (claude-sonnet-4-6) was used as the primary implementation assistant throughout this project.

## Tasks AI helped with

- **Scaffolding** — generating the full project structure from the scope document
- **Boilerplate** — Mongoose models, Zod schemas, shadcn/ui components
- **Auth.js config** — JWT callback wiring, session typing, middleware
- **Test scaffolding** — Vitest mocks for Next.js route handlers
- **Docker Compose** — multi-service setup with seed-on-start

## Prompting strategy

Provided the full PROJECT_SCOPE.md upfront, then requested the entire implementation in one pass. Corrections and refinements were made iteratively based on TypeScript errors and runtime behavior.

## What was verified manually

- Login flow with seeded credentials
- Document create / edit / delete
- Share flow (Alice → Bob)
- File upload (.txt and .md)
- Docker Compose cold start (seed runs automatically)
