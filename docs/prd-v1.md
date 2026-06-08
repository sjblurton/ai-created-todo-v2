# PRD: AI Todo App — V1

## Problem Statement

A user wants a simple, personal todo list they can access from any device. They need to be able to quickly add, view, edit, and remove todos, know which ones still need doing, and mark them off when complete — without managing a username and password.

## Solution

A web app where the user logs in once via an OAuth provider (Google or GitHub) and is taken straight to their personal todo list. They can create todos with a title and an optional due date, mark them Complete, edit them, and delete them. The list shows Incomplete todos by default, ordered oldest first, paginated so it stays fast. A toggle reveals Completed todos in the same list.

## User Stories

1. As a User, I want to sign in with my Google or GitHub account, so that I don't have to manage a separate username and password.
2. As a User, I want to be redirected to my todo list immediately after signing in, so that I can start working without extra steps.
3. As a User, I want to sign out, so that my todos are not visible to others using the same device.
4. As a User, I want to see only my own todos, so that my list is private.
5. As a User, I want to see my Incomplete todos by default when I open the app, so that I can focus on what still needs doing.
6. As a User, I want todos to be ordered oldest first, so that the things I've been putting off longest appear at the top.
7. As a User, I want the todo list to be paginated, so that the page stays fast even when I have many todos.
8. As a User, I want to create a Todo with a title, so that I can capture something I need to do.
9. As a User, I want to optionally add a due date when creating a Todo, so that I can track deadlines.
10. As a User, I want to see each Todo's due date in the list, so that I know when things are due at a glance.
11. As a User, I want to mark a Todo as Complete, so that I can record that I've finished it.
12. As a User, I want to mark a Complete Todo as Incomplete, so that I can reopen something I marked done by mistake.
13. As a User, I want to toggle the visibility of Completed todos in my list, so that I can review what I've already done without it cluttering my default view.
14. As a User, I want to edit the title of an existing Todo, so that I can correct mistakes or update what it means.
15. As a User, I want to edit the due date of an existing Todo, so that I can adjust a deadline.
16. As a User, I want to remove the due date from an existing Todo, so that I can make a dated todo undated.
17. As a User, I want to delete a Todo, so that I can remove things that are no longer relevant.
18. As a User, I want deleted Todos to be gone permanently, so that my list stays clean.
19. As a User, I want to use the app on any device, so that I can check and update my todos on the go.
20. As a User, I want the app to be fast to load, so that I can add a todo without waiting.

## Implementation Decisions

- **Framework:** Next.js 16 (App Router) with TypeScript and Tailwind CSS.
- **Backend:** Supabase — Postgres database, Auth, and Row Level Security.
- **API keys:** Supabase new key format (`sb_publishable_...` for client-side, `sb_secret_...` for server-side). Legacy `anon`/`service_role` keys are not used. See `docs/adr/0001-supabase-new-api-keys.md`.
- **ORM:** Prisma. All database queries go through `PrismaClient` in the Repository layer. Supabase hosts the Postgres database and Auth; Prisma owns all data access. Schema is defined in `prisma/schema.prisma`; migrations live in `prisma/migrations/`. See `docs/adr/0005-prisma-for-data-access.md`.
- **Auth:** OAuth only (Google and/or GitHub) via Supabase Auth. The app has a `/auth/callback` route that exchanges the OAuth code for a session. Session is refreshed on every request via Next.js middleware.
- **Architecture:** Four-layer, feature-based. Route Handlers are thin HTTP adapters that delegate to Controllers. Controllers orchestrate Service calls. Services contain domain logic. Repositories handle all Supabase data access. See the `api-versioned-routes` skill for the full spec.
  ```
  src/
  ├── app/api/v1/
  │   ├── todos/route.ts            ← Route Handler (GET, POST)
  │   ├── todos/[id]/route.ts       ← Route Handler (PATCH, DELETE)
  │   └── auth/
  │       ├── me/route.ts           ← Route Handler (GET)
  │       └── signout/route.ts      ← Route Handler (POST)
  ├── features/
  │   └── todos/api/todos.controller.ts
  └── lib/
      ├── services/todos.service.ts
      ├── repositories/todos.repository.ts
      └── supabase/
          ├── client.ts
          └── server.ts
  ```
- **API contract:**
  - `GET /api/v1/todos?page=1&limit=20&status=incomplete` — returns a paginated list of the User's Todos
  - `POST /api/v1/todos` — creates a new Todo
  - `PATCH /api/v1/todos/[id]` — updates a Todo's title, due date, or status
  - `DELETE /api/v1/todos/[id]` — permanently deletes a Todo
  - `GET /api/v1/auth/me` — returns the currently authenticated User (or 401)
  - `POST /api/v1/auth/signout` — signs the User out
- **Pagination:** Page-based. Query params: `page` (default 1), `limit` (default 20). Response includes `data`, `page`, `limit`, and `total`.
- **Todo schema:**
  ```
  todos
    id         uuid  primary key  default gen_random_uuid()
  user_id    uuid  not null  -- matches Supabase auth.uid(), no FK constraint (separate systems)
    title      text  not null
    due_date   date  (nullable)
    status     text  not null  default 'incomplete'  -- 'incomplete' | 'complete'
    created_at timestamptz  default now()
  ```
  Defined in `prisma/schema.prisma`. Apply with `npx prisma migrate dev` (local) or `npx prisma migrate deploy` (CI).
- **Row Level Security:** RLS policies remain on the Supabase schema as a safety net, but user isolation is enforced at the application layer — every Repository query filters by the authenticated User's ID. See `docs/adr/0005-prisma-for-data-access.md`.
- **Default sort:** `created_at` ascending (oldest first).
- **Component architecture:** Container/Presentation split throughout. Page files are thin route containers that call one Composition Hook and render a Presentation Component. Presentation Components are pure — they receive all data and callbacks via props and have no data-fetching hooks. Containers/Composition Hooks own hook calls and view-model assembly.
  ```
  src/
  ├── app/
  │   └── todos/
  │       ├── page.tsx                          ← Page (thin, calls 1 composition hook)
  │       └── hooks/useTodosPageComposition.ts  ← Composition Hook
  └── features/
      └── todos/
          ├── components/
          │   ├── TodoList.tsx                  ← Container
          │   └── TodoListPresentation.tsx      ← Presentation Component
          └── hooks/
              └── useTodoListPresentationProps.ts
  ```

- **Deletion:** Hard delete.

## Testing Decisions

- **What makes a good test:** Test external behaviour, not implementation details. Assert what the User sees or what data is returned — never assert on internal state or implementation details.
- **Test runner:** Vitest with `@testing-library/react` and `@testing-library/user-event`. See `docs/adr/0002-vitest-for-testing.md`.
- **MSW (Mock Service Worker):** Used to intercept HTTP calls to `/api/v1/*` in component and integration tests. Components and hooks are tested against MSW handlers that return controlled responses — no real Supabase calls in tests.
- **Layers tested:**
  - **Repository** — unit tested with a mocked Supabase client. Assert correct queries are built and correct shapes are returned.
  - **Service** — unit tested with a mocked Repository. Assert domain logic (e.g. pagination calculation, status transitions).
  - **Controller** — unit tested with a mocked Service. Assert correct HTTP status codes and response bodies.
- **Components/hooks** — integration tested with Testing Library + MSW handlers. Assert what renders and what the User can interact with. **Presentation Components are unit-tested directly with explicit props** (no hooks needed). **Containers and Composition Hooks are integration-tested** with real hooks plus MSW.
- **TDD workflow:** Write a failing test first, then implement the minimum code to make it pass, then refactor.
- **Prior art:** No existing tests yet. `src/test/setup.ts` is the starting point.

## Out of Scope

- Natural language / AI input (explicitly descoped — may be revisited in a future version).
- Email and password authentication.
- Collaborative or shared todos (multi-user).
- Todo priorities, tags, or categories.
- Notifications or reminders.
- Soft delete or a trash/archive view.
- Mobile native apps.
- Offline support.
- Real-time sync across tabs (Supabase Realtime).

## Further Notes

- Domain glossary is in `CONTEXT.md` at the project root. Use the terms defined there throughout the codebase.
- `AGENTS.md` notes that this Next.js version may differ from training data — read `node_modules/next/dist/docs/` before writing App Router code.
- The Supabase MCP server is installed and available for schema and data operations.
- No GitHub remote exists yet — this PRD is stored locally at `docs/prd-v1.md` until a repo is created.
