# Use the REST sign-out endpoint instead of a Server Action

Sign-out is handled by posting to `POST /api/v1/auth/signout` (the existing Route Handler) rather than a `'use server'` Server Action. The `<form action="/api/v1/auth/signout" method="POST">` pattern is used in `TodosPagePresentation`, which preserves progressive enhancement (no JavaScript required) while routing through the documented four-layer architecture (ADR-0003). The Server Action was removed because it bypassed the Repository/Service/Controller stack and called Supabase directly, creating two divergent sign-out paths.
