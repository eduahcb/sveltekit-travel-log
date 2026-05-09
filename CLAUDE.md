# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (starts both the local Turso DB and Vite dev server concurrently)
pnpm dev

# Start only the local Turso SQLite server
pnpm dev:db

# Type checking
pnpm check
pnpm check:watch

# Linting
pnpm lint
pnpm lint:fix

# Database
pnpm db:generate   # generate migrations from schema changes
pnpm db:migrate    # apply migrations
pnpm db:studio     # open Drizzle Studio

# Build & preview
pnpm build
pnpm preview
```

There are no automated tests. Use `pnpm check` for type safety.

## Environment Variables

Copy `.env.example` to `.env`. Required vars:

| Variable                                    | Purpose                                         |
| ------------------------------------------- | ----------------------------------------------- |
| `TURSO_DATABASE_URL`                        | `http://127.0.0.1:8080` for local dev           |
| `TURSO_AUTH_TOKEN`                          | Leave empty for local dev                       |
| `BETTER_AUTH_SECRET`                        | Random secret for better-auth                   |
| `BETTER_AUTH_URL`                           | `http://localhost:5173` for local dev           |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials                    |
| `VERCEL_URL`                                | Set to the deployed Vercel domain in production |

## Architecture

### Stack

- **SvelteKit** (Svelte 5 with runes) — full-stack framework
- **better-auth** — authentication with GitHub OAuth as the only provider
- **Drizzle ORM** + **Turso (libSQL/SQLite)** — database; local dev uses `turso dev --db-file local.db`
- **MapLibre GL** + **svelte-maplibre-gl** — interactive maps
- **TanStack Query** — client-side mutation state
- **sveltekit-superforms** + **valibot** — form validation (client + server)
- **Skeleton UI** — component library (Navigation, modals, etc.)
- **Tailwind CSS v4** — styling
- **ky** — HTTP client for API calls from the browser

### Auth flow

`hooks.server.ts` runs on every request: it calls `auth.api.getSession()`, attaches the result to `event.locals.session`, and redirects unauthenticated users away from `/dashboard/**`. The better-auth SvelteKit handler is mounted at the end of the hook.

The client-side `authClient` (`src/lib/aut-client.ts`) drives `signIn.social({ provider: "github" })` and `signOut()`.

All API route handlers are wrapped with `AuthenticatedRequestHandler` (`src/lib/server/auth-request-handler.ts`), which returns 401 when `locals.session` is absent.

### Database & schema

Schemas live in `src/lib/schema/` and export both Drizzle table definitions and valibot insert/select schemas (via `drizzle-valibot`). The main tables are `location` and `locationLog` (with `locationLogImage` planned). The DB client in `src/lib/server/db/index.ts` uses `snake_case` column mapping.

Migrations are generated and applied with `drizzle-kit` and stored in `src/lib/server/db/migrations/`.

### API routes

- `GET /api/locations` — fetch the authenticated user's locations
- `POST /api/locations` — create a location; handled by the `InsertLocation` service class which slugifies the name and retries on slug collisions (up to 3 attempts)
- `GET /api/search?q=...` — proxy to Nominatim (OpenStreetMap geocoder) for location search

### State management pattern

Global state uses **Svelte 5 context + reactive stores**. The dashboard layout (`src/routes/dashboard/+layout.svelte`) initializes two context stores:

- `locationContext` — a getter `() => Location[]` derived from server-loaded data
- `mapStore` — a `$state` object wrapping MapLibre GL state (map instance, markers, selected point, fly-to helpers); created by `createMapStore()` and depends on `locationContext`

Child routes access these via `getLocationContext()` / `getMapContext()`.

### Result type

Server service functions return `Response<T, E>` (defined in `src/lib/server/utils/http-response.ts`): `{ success: true; value: T } | { success: false; value: E }`. Prefer this over throwing in service layer code.

### Routing structure

```
/                        — landing / sign-in
/dashboard               — location list + map
/dashboard/add           — add location form with draggable marker and Nominatim search
/dashboard/location/[slug] — location detail (stub)
/sign-out                — triggers signOut
/error                   — auth error redirect target
/api/locations           — REST endpoint
/api/search              — Nominatim proxy
```

### ESLint

Uses `@antfu/eslint-config` with Svelte + TypeScript support. Double quotes, semicolons. Husky runs `lint-staged` (full lint) on pre-commit.
