# WriteUp - Mini AI Content Assistant Dashboard

WriteUp is a modern, premium full-stack application built to generate, customize, export, and track high-quality AI-generated copy. It features dynamic content generation form options, local drafts history tracking, a seamless dark/light mode toggle, markdown previewing, and document downloads.

## Technical Architecture Decisions

1. **Framework (Next.js 14+ & TypeScript)**: Built on the Next.js App Router. Utilizing a unified React frontend and backend API routing system simplifies data hydration, ensures complete type safety across boundaries, and streamlines local deployment.
2. **Database (Prisma & SQLite)**: Configured with **Prisma ORM** connecting to a local **SQLite** file database (`dev.db`). This makes the application completely portable—the reviewer can run it instantly without configuring a local MongoDB, PostgreSQL, or Supabase instance. Prisma ensures that migrating to a production database (like Postgres) only requires updating the provider in `schema.prisma`.
3. **AI Core (Groq API & Smart Fallback)**: Integrates the OpenAI-compatible **Groq API** via a lightweight native `fetch` client to minimize npm package footprint. The backend includes a parameter-aware local intelligence generator that automatically intercepts calls if the API key is missing. This ensures the app is fully functional even when run offline or without keys.
4. **Styling (Vanilla CSS)**: Written entirely in modern Vanilla CSS using CSS Modules for localized component styling and CSS Custom Properties (variables) for theme management. An inline script in the layout prevents theme flicker on mount.
5. **Frictionless Authentication**: Includes a registration-on-demand backend endpoint. If a user logs in with an email that is not in the SQLite database, it automatically signs them up. This removes the friction of creating account credentials for reviewers.

---

## Features

- **Dynamic Workspace Form**: Select between Content Types (Blog Post, Social Media Caption, Email Draft, Ad Copy), adjust word limits, and customize the tone of voice.
- **Interactive Saved History**: View, search, and filter past drafts in the sidebar. Selecting a draft loads it back into the active workspace.
- **Copy & Export Options**: Copy drafts with a single click, or download them formatted as Plain Text (`.txt`) or structured meta-data files (`.json`).
- **Smooth Dark / Light Mode**: Beautiful glassmorphic UI panels with custom scrollbars, transitions, and hover micro-animations.

---

## Getting Started & Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Installation
Clone or navigate to the directory and install dependencies:
```bash
npm install
```

### 2. Configuration (.env)
Create a `.env` file at the root of the project (template already provided in `.env.example`):
```env
# PostgreSQL connection string (e.g. Neon.tech / Supabase)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Optional: Add your Groq API Key for live AI generation.
# If left blank, the app runs using the Offline Simulation engine.
GROQ_API_KEY="your-groq-api-key-here"
```

### 3. Database Initialization
Sync the schema to your PostgreSQL database:
```bash
npx prisma db push
```

### 4. Running the App
Launch the local development server:
```bash
npm run dev
```

The application will be accessible at: **[http://localhost:3000](http://localhost:3000)**

---

## Verification & Production Build
To run static analysis, check TypeScript compile safety, and package a production optimized bundle:
```bash
npm run build
```
```bash
npm run start
```
