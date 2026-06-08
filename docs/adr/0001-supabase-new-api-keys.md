# Use Supabase publishable/secret keys, not legacy anon/service_role

The project uses Supabase's new key format (`sb_publishable_...` and `sb_secret_...`) instead of the legacy JWT-based `anon` and `service_role` keys. The legacy keys are deprecated and will be removed by the end of 2026. The publishable key is safe to expose client-side (`NEXT_PUBLIC_`); the secret key is server-only and never exposed to the browser.
