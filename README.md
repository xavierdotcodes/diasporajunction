# DiasporaJunxion

DiasporaJunxion is a SvelteKit app for diaspora-focused relocation, content, and paid access products around Ghana. The housing slice now supports:

- public diaspora-facing housing browsing
- Supabase Auth for owner login and session handling
- owner listing drafts with image upload support
- Stripe Checkout for a one-time listing submission fee
- manual review and publication through a lean admin workflow

## Stack

- SvelteKit
- Prisma + Postgres
- Tailwind
- Stripe
- Supabase Auth + Supabase Storage

## Local Setup

1. Copy envs:

```bash
cp .env.example .env
```

2. Fill in at least:

- `DIRECT_DATABASE_URL`
- `DATABASE_URL`
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_HOUSING_STORAGE_BUCKET`
- `PUBLIC_SUPABASE_ENABLE_GOOGLE_AUTH=0`
- `PUBLIC_SUPABASE_ENABLE_FACEBOOK_AUTH=0`
- `STRIPE_SECRET_KEY` and the right webhook secret for your environment
- `HOUSING_ADMIN_EMAILS` with the Supabase email(s) allowed to operate `/admin/housing`

3. Install dependencies:

```bash
bun install
```

4. Apply migrations:

```bash
bunx prisma migrate deploy
```

For local development, `bunx prisma migrate dev` is also fine.

5. Seed sample housing listings if you want a usable starting point:

```bash
bunx prisma db seed
```

6. Start the app:

```bash
bun run dev
```

## Housing Routes

Public housing:

- `/housing`
- `/housing/listings`
- `/housing/listings/[slug]`
- `/housing/list-your-property`

Owner portal:

- `/housing/owners`
- `/housing/owners/listings/[id]`

Auth:

- `/login`
- `/signup`
- `/auth/callback`
- `/auth/logout`

Admin:

- `/admin/housing`

## Stripe Flow

Property owners pay a one-time listing submission fee. The flow is:

1. Owner signs in with Supabase.
2. Owner creates or edits a listing draft.
3. Owner uploads images to Supabase Storage.
4. Owner clicks pay and submit.
5. Stripe Checkout opens in `mode=payment`.
6. The webhook marks the listing `PENDING_REVIEW` after successful payment.

Stripe webhook fulfillment is handled in:

- `src/routes/api/community/stripe-webhook/+server.js`

## Supabase Notes

The app now supports:

- email/password auth
- Google OAuth
- Facebook OAuth

Google and Facebook buttons are hidden by default. Turn them on only when the provider is actually configured by setting:

- `PUBLIC_SUPABASE_ENABLE_GOOGLE_AUTH=1`
- `PUBLIC_SUPABASE_ENABLE_FACEBOOK_AUTH=1`

If you enable Google or Facebook in Supabase, make sure the provider setup is completed in the Supabase dashboard and your redirect allow list includes:

- local app origin
- deployed app origin
- `/auth/callback`

For listing images, create a Supabase Storage bucket matching `PUBLIC_HOUSING_STORAGE_BUCKET`. The current client upload flow expects a bucket configured for browser uploads and public image URLs.

## Verification

Production build:

```bash
bunx vite build
```

Prisma client:

```bash
bunx prisma generate
```

## Additional Notes

- The housing admin route accepts either the legacy internal admin session or a Supabase-authenticated email listed in `HOUSING_ADMIN_EMAILS`.
- The seed script is idempotent for the sample listings and safe to rerun.
- Existing older auth/session flows are still present for legacy parts of the app.
