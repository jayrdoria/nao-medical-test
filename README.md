# Ajaia Docs

A full-stack document editor with sharing, built with Next.js 15, MongoDB, Auth.js v5, and Tiptap.

## Quick Start (Docker Compose — recommended)

```bash
docker compose up --build
```

The app seeds 3 test users automatically on first startup.

Open [http://localhost:3000](http://localhost:3000)

### Demo accounts

| Name  | Email              | Password    |
|-------|--------------------|-------------|
| Alice | alice@ajaia.dev    | password123 |
| Bob   | bob@ajaia.dev      | password123 |
| Carol | carol@ajaia.dev    | password123 |

## Local Setup (without Docker)

### Prerequisites
- Node.js 22 LTS
- MongoDB 7 running on `localhost:27017`

### Steps

```bash
npm install
cp .env.example .env.local   # Edit MONGODB_URI to point to your local Mongo
npx tsx scripts/seed.ts      # Seed test users
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Running Tests

```bash
npm test
```

## Features

- **Auth** — credentials login with JWT session
- **Dashboard** — view owned and shared documents
- **Editor** — Tiptap rich text editor with auto-save (1.5s debounce)
- **Sharing** — share documents by email
- **File Upload** — upload `.txt` and `.md` files to create documents

## Environment Variables

See `.env.example` for the full list.

| Variable         | Description                        |
|------------------|------------------------------------|
| MONGODB_URI      | MongoDB connection string          |
| NEXTAUTH_SECRET  | JWT signing secret (min 32 chars)  |
| NEXTAUTH_URL     | Base URL for Auth.js callbacks     |
