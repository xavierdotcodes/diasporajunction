# Housing Owner Portal Setup

## Required environment variables

```bash
DIRECT_DATABASE_URL=
DATABASE_URL=
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_PUBLISHABLE_KEY=
PUBLIC_HOUSING_STORAGE_BUCKET=housing-listings
PUBLIC_SUPABASE_ENABLE_GOOGLE_AUTH=0
PUBLIC_SUPABASE_ENABLE_FACEBOOK_AUTH=0
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
HOUSING_ADMIN_EMAILS=you@example.com
```

For local Stripe testing, you can also use:

```bash
STRIPE_TEST_SECRET_KEY=
STRIPE_TEST_WEBHOOK_SECRET=
```

## First-time setup

1. Apply the Prisma migrations:

```bash
bunx prisma migrate deploy
```

2. Seed sample listings:

```bash
bunx prisma db seed
```

3. Start the app:

```bash
bun run dev
```

## Supabase setup

- Enable email auth in Supabase.
- Add your local and production app origins to the Supabase redirect allow list.
- Add `/auth/callback` to the allowed redirect targets.
- Google and Facebook login stay off unless you explicitly enable them with `PUBLIC_SUPABASE_ENABLE_GOOGLE_AUTH=1` or `PUBLIC_SUPABASE_ENABLE_FACEBOOK_AUTH=1`.
- Configure Google and Facebook in the Supabase dashboard if you want social login.
- Set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` in local and deployed envs.

## Supabase Storage setup

- Create a storage bucket matching `PUBLIC_HOUSING_STORAGE_BUCKET`.
- The current owner portal uploads directly from the browser through the authenticated Supabase session.
- Configure the bucket and policies so signed-in owners can upload images and the uploaded image URLs can render publicly in listings.

## Stripe setup

- Owner listing submission uses a one-time Checkout Session.
- Successful Checkout is fulfilled in `src/routes/api/community/stripe-webhook/+server.js`.
- Make sure Stripe sends `checkout.session.completed` events to your deployed webhook endpoint.

## Admin workflow

The housing admin page lives at `/admin/housing`.

Access is granted when either:

- the old internal admin session is present, or
- the signed-in Supabase email is listed in `HOUSING_ADMIN_EMAILS`

## What gets created

- `HousingListing`
- `HousingListingImage`
- `HousingInquiry`
- `HousingListingPayment`
