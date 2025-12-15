# Terror Watch Australia – Task 1

SvelteKit + TypeScript skeleton configured for Railway deployment. Includes Node adapter, Drizzle/PostgreSQL wiring, Zod, linting, formatting, and a basic API health check.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` – start the dev server
- `npm run check` – type-check via svelte-check
- `npm run lint` – svelte-check + ESLint (type-aware) + Prettier rule
- `npm run format` – verify Prettier formatting
- `npm run format:write` – apply Prettier formatting
- `npm run build` – production build with `@sveltejs/adapter-node`
- `npm run preview` – preview the production build locally
- `npm run db:generate` – run Drizzle Kit (PostgreSQL) using `drizzle.config.ts`

## Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` – PostgreSQL connection string (Railway-provided)
- `AI_API_KEY` – optional external AI provider key

## Deployment (Railway)

- Configured via `railway.json` with Nixpacks builder.
- Start command: `node build/index.js`
- Health check: `GET /api/health` returns `{"status":"ok"}`.

## Project structure

```
src/
├── lib/
│   ├── components/        # shared UI
│   └── server/
│       ├── db/            # Drizzle/PostgreSQL client + schema
│       └── services/      # server-only business logic
├── routes/
│   ├── api/health         # health check endpoint
│   └── +page.svelte       # placeholder homepage
└── app.d.ts               # SvelteKit app types
```
