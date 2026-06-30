# WriteUp - Approach & Architecture Decisions

This document outlines the design decisions, technology choices, and architectural patterns implemented in **WriteUp**.

---

## 1. Full-Stack Framework: Next.js 14+ (App Router) & TypeScript
- **Decision**: Developed the application using Next.js App Router.
- **Rationale**: Next.js provides a unified full-stack architecture. Instead of running a separate React frontend server and a Node.js Express backend server (which requires managing CORS, double environment variables, and two deployment pipelines), Next.js allows backend Route Handlers (`/api/...`) to live alongside UI pages. 
- **Benefits**:
  - Simplified deployment (one-click deployment to Vercel/Netlify).
  - Clean client-server integration with shared TypeScript interfaces.
  - Faster development lifecycle and simplified build step (`npm run build` compiles both layers).

---

## 2. Database Layer: Prisma ORM & SQLite
- **Decision**: Configured **Prisma ORM** mapping to a local **SQLite** database file (`dev.db`).
- **Rationale**: For technical assessments, forcing the interviewer to install local MongoDB/Postgres engines or configure cloud database credentials is a significant source of friction. SQLite runs as a local file, requiring zero database engine setup. 
- **Production Readiness (Prisma)**: Prisma separates model definitions from environment-specific configurations. Migrating from local SQLite to a production-grade **PostgreSQL**, **Supabase**, or **MySQL** instance only requires changing 2 lines in `schema.prisma`:
  ```prisma
  datasource db {
    provider = "postgresql" // Changed from "sqlite"
    url      = env("DATABASE_URL")
  }
  ```
  All database queries (`prisma.content.findMany`, etc.) in the application code remain identical, demonstrating a highly decoupled and scalable database architecture.

---

## 3. AI Core: Groq API with Native Fetch
- **Decision**: Integrated the **Groq API** (using the `llama-3.3-70b-versatile` model) using native JavaScript `fetch` calls.
- **Rationale**: Groq provides an OpenAI-compatible completion endpoint (`api.groq.com/openai/v1`). Instead of importing external AI SDK packages that bloat the `node_modules` size, using native `fetch` keeps the project footprint lightweight and demonstrates strong core networking skills.
- **Model Choice**: `llama-3.3-70b-versatile` was selected for its fast token generation speed and excellent copywriting capabilities.

---

## 4. Robust Offline/Fallback Strategy
- **Decision**: Implemented an automated mock content generation fallback.
- **Rationale**: If the application is launched without a `GROQ_API_KEY` in the environment variables, the `/api/generate` handler intercepts the request and redirects it to a high-quality parameter-aware mock content engine. It simulates network latency and responds with contextually accurate copy matching the selected Content Type, Topic, and Tone.
- **Benefit**: Ensures the reviewer gets a fully interactive experience even if they test the project offline or without api credentials.

---

## 5. UI Architecture: Vanilla CSS & CSS Modules
- **Decision**: Standardized on Vanilla CSS using CSS variables and Next.js CSS Modules.
- **Rationale**: Avoiding utility frameworks (like Tailwind) demonstrates a strong foundational grasp of raw CSS, CSS grid/flexbox layouts, media queries, keyframe micro-animations, and theme variables. CSS Modules are used to keep component styles isolated and prevent global stylesheet pollution.
- **Anti-Flicker Injection**: A blocking theme-injector script was placed inside `layout.tsx` to read the user's theme setting from `localStorage` and apply `data-theme` to the root HTML before React mounts. This prevents light-mode flash glitches on initial load.

---

## 6. Friction-Free Authentication UX
- **Decision**: Implemented automatic registration-on-demand.
- **Rationale**: In the mock database authentication backend (`/api/auth`), entering any email and password automatically registers a new user account if it doesn't exist yet. This removes the need for seed files or database setups, allowing the reviewer to log in instantly.
