# Task 1: Project Setup & Railway Configuration

## Context
- Project: Terror Watch Australia
- Location: /home/anombyte/Projects/in-progress/terror
- Reference: GIGA_PRD.md, ATLAS_STATE.md

## Goal
Initialize a SvelteKit project with TypeScript, configure for Railway deployment.

## Requirements
1. Create SvelteKit project with `npm create svelte@latest . -- --template skeleton --types typescript`
2. Add essential dependencies:
   - `@sveltejs/adapter-node` for Railway
   - `drizzle-orm` and `drizzle-kit` for database
   - `postgres` for PostgreSQL driver
   - `zod` for validation
3. Configure `svelte.config.js` for Node adapter
4. Create basic project structure:
   ```
   src/
   ├── lib/
   │   ├── server/
   │   │   ├── db/
   │   │   └── services/
   │   └── components/
   ├── routes/
   │   ├── api/
   │   └── +page.svelte
   └── app.d.ts
   ```
5. Create `.env.example` with required variables:
   - DATABASE_URL
   - AI_API_KEY (optional)
6. Create `railway.json` or `railway.toml` for deployment config
7. Add health check endpoint at `/api/health`
8. Create basic homepage placeholder

## Acceptance Criteria
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] `/api/health` returns `{"status": "ok"}`
- [ ] TypeScript strict mode enabled
- [ ] ESLint and Prettier configured

## On Completion
1. Run `npm run build` to verify
2. Commit all changes with message: "Task 1: SvelteKit project setup with Railway config"
3. Create `.sprint-complete.json`:
   ```json
   {"task": 1, "status": "complete", "files": [LIST_OF_FILES]}
   ```
