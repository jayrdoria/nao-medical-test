# Ajaia Docs

A full-stack document editor with sharing, built with Next.js 15, MongoDB Atlas, Auth.js v5, and Tiptap.

---

## Prerequisites

Before running the project, make sure the following are installed on your machine:

### 1. Install Docker Desktop
Docker is required to run the app — no Node.js or MongoDB setup needed locally.

- Download: https://www.docker.com/products/docker-desktop/
- Install and **open Docker Desktop** before proceeding
- Wait until the Docker whale icon in your taskbar shows **"Docker Desktop is running"**

> Windows users: Docker Desktop requires WSL 2. The installer will guide you through enabling it if not already active.

---

## Quick Start

### Step 1 — Get the project

```bash
git clone https://github.com/jayrdoria/nao-medical-test.git
cd nao-medical-test
```

### Step 2 — Add the environment file

A `.env.local` file is included in the Google Drive submission folder.

Copy it into the root of the project:

```
nao-medical-test/
├── .env.local        ← paste it here
├── docker-compose.yml
├── ...
```

### Step 3 — Start the app

```bash
docker compose up --build
```

> The first build takes 2–3 minutes. Subsequent starts are much faster.

The app will automatically seed 3 test users on first startup.

### Step 4 — Open the app

```
http://localhost:3000
```

---

## Test Accounts

| Name  | Email           | Password    |
|-------|-----------------|-------------|
| Alice | alice@ajaia.dev | password123 |
| Bob   | bob@ajaia.dev   | password123 |
| Carol | carol@ajaia.dev | password123 |

---

## Test Flow

1. Login as **Alice**
2. Click **New Document** → write and format content
3. Click **Share** → enter `bob@ajaia.dev`
4. Sign out → login as **Bob**
5. See Alice's doc under **Shared with Me** → open and edit it
6. Try **Upload** → drag & drop a `.txt` or `.md` file

---

## Running Tests

```bash
docker exec ajaia-app npm test
```

---

## Features

- Credentials login with JWT session
- Dashboard — My Documents + Shared with Me
- Tiptap rich text editor (Bold, Italic, Underline, H1/H2/H3, lists)
- Auto-save on change (1.5s debounce)
- Share documents by email — modal shows who it's shared with
- Drag & drop file upload (.txt and .md)
- Inline rename and delete

---

## Stopping the App

```bash
docker compose down
```
