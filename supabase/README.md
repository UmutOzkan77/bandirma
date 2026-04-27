# Supabase setup

1. Copy `.env.example` to `.env` or `.env.local` and fill the Supabase keys.
2. Run the SQL file under `supabase/migrations/` in Supabase SQL Editor or with the Supabase CLI.
3. Optionally run `supabase/seed.sql` for demo academic data.
4. Import student accounts with:
   `node scripts/import-students.mjs supabase/examples/students-template.csv`
5. Imported students sign in with `school_email + tc_kimlik`, then the app forces a password change.

Notes:
- Demo signup stays client-side behind `EXPO_PUBLIC_ENABLE_DEMO_SIGNUP=true`.
- Manual add/remove course overrides and absence tracking remain local on the device.
- The import script does not reset existing passwords unless you pass `--reset-passwords`.
