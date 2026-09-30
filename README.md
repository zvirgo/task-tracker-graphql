# 🚀 Full-Stack Interactive Task Tracker

An enterprise-ready, interactive Task Management platform built with a high-performance modern web stack: **React 18**, **TypeScript**, **Material UI (MUI v6)**, **Apollo GraphQL**, and **Prisma ORM** with **SQLite**, fully containerized via **Docker**.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Material UI (MUI v6), Emotion, `@hello-pangea/dnd` |
| **Data & API** | GraphQL, Apollo Client (Cache management & Optimistic UI), Apollo Server |
| **Codegen & Typing** | GraphQL Code Generator (`client-preset`) |
| **Backend & ORM** | Node.js, Prisma ORM (v6.x) |
| **Database** | SQLite (with persistent volume mounting) |
| **DevOps & Containers** | Docker, Docker Compose (Multi-Stage Node/Alpine images) |

---

## 📸 Architecture & Structure

```text
├── client/                 # React 18 frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # TaskCard, KanbanColumn, CreateTaskDialog
│   │   ├── graphql/        # Operation definitions (queries & mutations)
│   │   ├── apolloClient.ts # Apollo Client setup with cache merge policies
│   │   └── App.tsx         # Main Kanban board orchestrator
│   └── codegen.ts          # GraphQL Code Generator configuration
│
└── server/                 # Apollo Server & Data Layer
    ├── prisma/             # Schema definitions and SQLite database
    ├── src/
    │   ├── typeDefs.ts     # GraphQL schema specifications
    │   ├── resolvers.ts    # Database query/mutation resolvers via Prisma
    │   └── index.ts        # Standalone server bootstrap
    └── Dockerfile          # Multi-stage production build configuration

```

---

## ✨ Key Features

- **Enterprise Kanban Layout:** Distinct workflow status columns (`TODO`, `IN_PROGRESS`, `DONE`) featuring color-coded visual priority indicators (`LOW`, `MEDIUM`, `HIGH`).
- **Fluid Drag-and-Drop:** Intuitive card movement across lanes powered by `@hello-pangea/dnd` with natural layout animations and zero lag.
- **Optimistic UI Updates:** Instant UI feedback on task transitions and mutations backed by Apollo Client's InMemoryCache.
- **End-to-End Type Safety:** Strongly-typed contracts from the Prisma database schema all the way to frontend React components and GraphQL operations.
- **Persistent Data Management:** Automated SQLite schema migrations and updates managed via Prisma Client.
- **Production Containerization:** Optimized multi-stage Docker build producing lightweight runner containers with persistent host volume mounting.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or v20.x recommended)
- npm or yarn
- Docker Desktop *(Optional, for containerized run)*

---

### Local Development Setup

#### 1. Backend (Server)

```bash
cd server

# Install dependencies
npm install

# Push schema to SQLite & generate Prisma Client
npx prisma db push

# Start Apollo Server in watch mode
npm run dev

```

The GraphQL endpoint will be active at:

👉 `http://localhost:4000/`

---

#### 2. Frontend (Client)

In a separate terminal window:

```bash
cd client

# Install dependencies
npm install

# Generate TypeScript types from GraphQL schema
npm run codegen

# Start Vite dev server
npm run dev

```

The client application will be running at:

👉 `http://localhost:5173/`

---

## 🐳 Running with Docker

To spin up the containerized backend environment with volume persistence:

```bash
# From the project root directory
docker compose up --build -d

```

Check running container status:

```bash
docker compose ps

```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
