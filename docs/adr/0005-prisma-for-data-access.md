# Use Prisma for database access in the Repository layer

All database queries go through **Prisma** (via a `PrismaClient` instance) rather than the Supabase JS client's data API. Supabase is still used for Auth (OAuth sessions, middleware token refresh) and hosts the Postgres database, but the Repository layer talks to it over a direct Postgres connection managed by Prisma.

## Why

- **Type safety end-to-end.** Prisma generates TypeScript types from `prisma/schema.prisma`, so query results are fully typed without manual interface maintenance.
- **Explicit migrations.** Schema changes live in `prisma/migrations/` as versioned SQL files, giving a clear audit trail and repeatable apply-on-deploy story.
- **Testability.** The Prisma client is easily mocked or swapped for a test client; the Repository layer receives it via dependency injection.
- **Readable queries.** Prisma's query API is more ergonomic than raw SQL strings and avoids the quirks of the Supabase JS `.from().select()` builder.

## Trade-offs accepted

- **RLS bypassed at the DB level.** Prisma connects via the `SUPABASE_SECRET_KEY` / direct Postgres URL (service-role equivalent), which bypasses Row Level Security. User isolation is enforced at the **application layer** instead: every Repository query includes a `where: { userId }` clause derived from the authenticated session. This is a deliberate trade-off for developer ergonomics; the Supabase schema retains RLS policies as a safety net for any non-Prisma access.
- **Two Supabase connection surfaces.** Auth operations use `@supabase/ssr`; data operations use Prisma. These are intentionally separate concerns.

## Schema location

`prisma/schema.prisma` is the single source of truth for the `todos` table shape. Supabase-hosted Postgres is the migration target. Run `npx prisma migrate dev` locally and `npx prisma migrate deploy` in CI/CD.
