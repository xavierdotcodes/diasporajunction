# DiasporaJunxion MCP

This folder is the ChatGPT-facing control layer for DiasporaJunxion. It exposes a safe MCP server so ChatGPT can inspect directory operations, help admins triage work, and call AI support flows without unrestricted database, filesystem, shell, Stripe, or document-storage access.

The MCP server is read-first. Write tools are present only as guarded interfaces and require explicit `confirm: true`; they must call safe Convex mutations that log `activityEvents`.

## Runtime

- Package root: `diasporajunxion/mcp`
- Entrypoint: `src/mcp/server.js`
- Tool registry: `src/mcp/tools`
- Convex client wrapper: `src/mcp/clients/convex.js`
- AI/Mastra compatibility client: `src/mcp/clients/mastra.js`
- Inngest placeholder client: `src/mcp/clients/inngest.js`
- SvelteKit HTTP bridge: `src/routes/api/mcp/+server.js`

The standalone server defaults to stdio for local MCP clients. Set `MCP_TRANSPORT=http` or `MCP_TRANSPORT=sse` to run a local HTTP control surface.

## Commands

```sh
bun install
bun run dev
bun run test
bun run typecheck
MCP_TRANSPORT=http MCP_PORT=8787 bun run dev
```

The SvelteKit app preview remains available with:

```sh
bun run app:dev
```

## Environment

Required for real Convex-backed tools:

- `CONVEX_URL`
- `CONVEX_DEPLOYMENT` if the deployment requires it

Required for live Ollama Cloud AI execution:

- `OLLAMA_API_KEY` or `OLLAMA_CLOUD_API_KEY`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`

Optional future AI env:

- `OLLAMA_EMBED_MODEL` for embeddings when semantic search is added
- `CONVEX_ADMIN_KEY` or a narrower service token if the final auth design requires it
- `DIASPORAJUNXION_ADMIN_TOKEN` if app-level admin auth is added

Optional or future integrations:

- `MASTRA_BASE_URL`
- `MASTRA_API_KEY`
- `INNGEST_EVENT_KEY`
- `INNGEST_BASE_URL`
- `MCP_TRANSPORT=stdio|http|sse`
- `MCP_PORT`

Payment env belongs to the application layer, not MCP responses:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_APPLICATION_FEE_PRICE_ID`
- `STRIPE_VERIFICATION_FEE_PRICE_ID`
- `STRIPE_FEATURED_LISTING_PRICE_ID`
- `STRIPE_FEATURED_LISTING_AMOUNT_CENTS` optional ledger display amount
- `STRIPE_FEATURED_LISTING_CURRENCY` optional ledger currency
- `STRIPE_VERIFIED_LISTING_PRICE_ID` optional future verified-listing price
- `STRIPE_FOUNDING_LISTING_PRICE_ID` optional future founding-offer price
- `PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `APP_BASE_URL` or `PUBLIC_APP_URL`
- `STRIPE_APPLICATION_FEE_AMOUNT_CENTS` optional ledger display amount
- `STRIPE_APPLICATION_FEE_CURRENCY` optional ledger currency

Secrets are never returned by MCP tools.

## Monetizable Directory Lifecycle

The first paid lifecycle is:

1. A business submits `/apply`.
2. Convex creates and submits a `directoryApplications` record.
3. `/apply/[applicationId]/payment` creates a generic `payments` ledger record for `LISTING_APPLICATION_FEE`.
4. Stripe Checkout starts from the server using `STRIPE_APPLICATION_FEE_PRICE_ID`.
5. `/api/stripe/webhook` verifies Stripe signatures with `STRIPE_WEBHOOK_SECRET`.
6. Verified Stripe events update Convex through webhook-only mutations:
   - `payments:markSucceededFromWebhook`
   - `payments:markFailedFromWebhook`
   - `payments:markAbandoned`
7. Successful webhook processing moves the related application to `PAID`.
8. A human admin can approve and convert the application through guarded admin UI/actions.
9. The converted listing is active and appears in public directory search.
10. Public listing profile/contact actions log interactions.

Client success/cancel pages never mark payment success. Payment success comes only from verified webhook handling.

## Stripe Webhook Setup

Local webhook testing:

```sh
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

Configure the resulting webhook secret as `STRIPE_WEBHOOK_SECRET`.

Handled Stripe events:

- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.expired`

Webhook idempotency is tracked in Convex with `paymentWebhookEvents` keyed by provider and Stripe event id.

## Auth Architecture

The `mcp/` app now has scoped email/password session auth backed by Convex users and sessions.

Auth routes:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password` placeholder only

Session behavior:

- The browser receives an opaque `dj_mcp_session` cookie.
- Cookie options are `httpOnly`, `sameSite=lax`, `path=/`, and `secure` in production.
- Convex stores only the SHA-256 hash of the session token in `sessions`.
- Passwords are stored as salted Node `scrypt` hashes in `users.passwordHash`.
- Passwords, hashes, raw session tokens, and admin tokens must not be logged or returned by API responses.
- Server-only password-hash lookup and session creation require `MCP_AUTH_INTERNAL_SECRET`; if it is not set, the server falls back to `DIASPORAJUNXION_ADMIN_TOKEN` or `ADMIN_ACTION_TOKEN`.

User model:

- `users.email`
- `users.name`
- `users.passwordHash`
- `users.role`: `USER`, `LISTING_OWNER`, or `ADMIN`
- `users.emailVerifiedAt`
- `users.isDeleted`
- `users.createdAt` / `users.updatedAt`

Role behavior:

- New registrations start as `USER`.
- Application creation sets `directoryApplications.applicantUserId` from the authenticated Convex user.
- Admin conversion sets `directoryListings.ownerUserId` from the application applicant and promotes `USER` to `LISTING_OWNER`.
- Owner dashboard queries compare the session Convex user ID to `directoryListings.ownerUserId`.
- Admin checks prefer real session users with `role: ADMIN`.

Temporary admin fallback:

- `DIASPORAJUNXION_ADMIN_TOKEN` or `ADMIN_ACTION_TOKEN` still works for admin routes/tools while real admin sessions are being verified.
- The fallback is centralized in `src/lib/server/auth.js` and Convex `_auth.ts`.
- Do not remove this fallback until a real admin user can log in and complete all admin review actions.
- The fallback does not create a fake persistent Convex user.

Admin actions currently exposed in the simple UI:

- add admin note
- mark under review
- request resubmission with note
- approve and convert application

The UI does not expose rejection, automatic approval, or payment success override.

First admin in development:

1. Register normally with `POST /auth/register`.
2. Use the temporary admin token to call `users:setRole` with `role: ADMIN`, or patch the user role directly in Convex dashboard for local development.
3. Log in with `POST /auth/login`.
4. Confirm `/auth/me` returns `role: ADMIN`.

Remaining auth gaps:

- No password reset email flow yet.
- No email verification delivery yet; `emailVerifiedAt` is schema-supported.
- No OAuth/social auth is implemented in this app scope.
- Temporary admin token fallback remains intentionally enabled.

## Access Matrix

Routes:

- Public: `/directory`, `/directory/ghana`, `/directory/ghana/[category]`, `/directory/[city]`, `/directory/[city]/[category]`, `/directory/profile/[slug]`, `/guides`, `/guides/[slug]`, `/providers`
- Authenticated start: `/apply`
- Application owner or admin: `/apply/[applicationId]`, `/apply/[applicationId]/payment`, `/apply/[applicationId]/success`, `/apply/[applicationId]/cancel`
- Listing owner or admin: `/dashboard`, `/dashboard/listings`, `/dashboard/listings/[id]`, `/dashboard/listings/[id]/edit`, `/dashboard/listings/[id]/media`, `/dashboard/listings/[id]/upgrade`, `/dashboard/listings/[id]/analytics`
- Admin only: `/admin`, `/admin/applications`, `/admin/applications/[id]`, `/admin/listings`, `/admin/listings/[id]`

Convex functions:

- Public: `listings:search`, `listings:getBySlug`, `listings:getById` for active listings only, `interactions:log`
- Owner/admin: `applications:getById`, `applications:updateDraft`, `applications:submit`
- Admin: `adminDashboard:*`, `applications:list*`, `applications:admin*`, `listings:admin*`, admin listing maintenance queries, `payments:list*`, `payments:get*`, `activity:*`, interaction summaries
- Webhook only: `payments:markSucceededFromWebhook`, `payments:markFailedFromWebhook`, `payments:markAbandoned`, `payments:handleStripeWebhook`

Payment success remains webhook-only. Client routes can create checkout and mark payment initiated, but they cannot mark payment successful.

## Provider Landing And Supply-Side Offer

Provider landing route:

- `/providers`

Primary offer:

- Founding AI-searchable verified profile for Ghana-based service providers.
- Verified public profile with category and location visibility.
- WhatsApp, phone, email, and website contact buttons.
- Logo, cover image, gallery, and portfolio media.
- Profile completeness guidance and AI-powered profile suggestions.
- Lead/contact tracking in the owner dashboard.
- Early featured visibility while the platform grows.
- Profile structure prepared for ChatGPT-style discovery.

Honest positioning:

- DiasporaJunxion does not guarantee instant customers, traffic, bookings, or ChatGPT placement.
- The provider promise is to make a business easier to trust, easier to find, and easier to contact by diaspora customers and people searching for Ghana-based services.
- Payment remains tied to the existing application, verification, and listing review flow; this milestone does not change Stripe or payment lifecycle behavior.

AI-searchable explanation:

- Most directories depend on exact category browsing.
- DiasporaJunxion structures provider profiles so people can describe needs in plain English, such as “I need a reliable driver in Accra” or “I need housing help for a diaspora visitor.”
- The platform can use structured profile data to recommend relevant verified listings.
- Copy may say “built to support ChatGPT-style discovery” or “preparing listings for AI-powered search,” but must not claim guaranteed ChatGPT placement or guaranteed traffic.

Provider sales talking points:

- “Get a verified, diaspora-facing public profile.”
- “Show customers your services, location, contact options, and portfolio media.”
- “Use your dashboard to improve completeness and see contact activity.”
- “Prepare your profile for AI-powered search without overpromising outcomes.”
- “Founding providers receive early visibility while the directory grows.”

Remaining marketing gaps:

- Pricing table is static copy, not yet backed by CMS/config.
- No provider case studies or testimonials yet.
- No visual brand/media assets for the landing page beyond text-first copy.
- No email nurture sequence after application submission.
- No A/B testing or conversion analytics for the provider funnel.

## Provider Plans And Paid Upgrades

Simple listing plan fields:

- `plan`: `BASIC`, `VERIFIED`, `FEATURED`, or `FOUNDING`
- `planStatus`: `ACTIVE`, `INACTIVE`, `EXPIRED`, or `CANCELLED`
- `planStartedAt`
- `planExpiresAt`
- `isFeatured`
- `featuredUntil`
- `upgradeSourcePaymentId`
- `lastUpgradeAt`

Current plan model:

- Founding Verified Listing: handled through the existing application, payment, verification, and listing review flow. Approved listings get the provider dashboard, media tools, profile completeness, AI suggestions, and lead/contact tracking.
- Featured Listing: one-time Stripe Checkout upgrade from `/dashboard/listings/[id]/upgrade`. Webhook-confirmed success activates `plan: FEATURED`, `planStatus: ACTIVE`, `isFeatured: true`, and a 30-day `featuredUntil`.
- Future Growth Plan / Subscription: documented as coming soon. No recurring subscription lifecycle is active in this milestone.

Featured listing rules:

- Owners cannot directly set `isFeatured`, `featuredUntil`, `plan`, or `planStatus`.
- Featured state is activated only by an admin-safe operation or trusted Stripe webhook success.
- Public search sorts active featured listings above standard listings.
- Expired `featuredUntil` values are treated as not featured for public display/sorting.
- Public listing output exposes only featured status, not payment records or payment references.
- Featured placement increases visibility within DiasporaJunxion surfaces only. It does not guarantee customers, external traffic, or ChatGPT placement.

Owner upgrade flow:

1. Listing owner opens `/dashboard/listings/[id]/upgrade`.
2. The page shows current plan, plan status, verification status, featured status, and honest expectations.
3. The owner starts Stripe Checkout for `FEATURED_LISTING`.
4. The app creates a pending payment record and marks it initiated with the Stripe Checkout session ID.
5. Stripe webhook verifies success and applies the featured plan.
6. The client success return page only says payment is being verified; it never marks success.

Remaining upgrade/subscription gaps:

- No recurring subscription billing UX yet.
- No renewal reminders for expiring featured listings.
- No coupon/referral pricing logic.
- No automated downgrade job for expired featured records; public display and sorting already ignore expired featured dates.

## Convex Validation

Expected validation flow:

```sh
bunx convex dev
```

or, once a deployment is linked:

```sh
bunx convex dev --once
```

Required deployment config:

- `CONVEX_URL`
- `CONVEX_DEPLOYMENT` if required by the deployment
- `CONVEX_ADMIN_KEY` or a narrower server token if admin server calls require it
- `MCP_AUTH_INTERNAL_SECRET` for server-only auth lookups and session creation
- `DIASPORAJUNXION_ADMIN_TOKEN` or production admin session auth
- `STRIPE_WEBHOOK_SECRET` for webhook-only payment success mutations

If Convex is not linked locally, do not treat mocked MCP tests as deployment validation. They verify wrapper behavior, not a live Convex deployment.

Check command caveat:

- `bun run test`, `bun run lint`, `bun run typecheck`, `bun run build`, and `bunx convex dev --once` should pass for this package.
- `bun run check` may still fail on pre-existing project-wide JavaScript typing issues; do not treat unrelated historical check noise as an auth regression unless it touches this scope.

## Provider Dashboard And Analytics

Provider/listing owner routes:

- `/dashboard`
- `/dashboard/listings`
- `/dashboard/listings/[id]`
- `/dashboard/listings/[id]/edit`
- `/dashboard/listings/[id]/media`
- `/dashboard/listings/[id]/upgrade`
- `/dashboard/listings/[id]/analytics`

Owner dashboard Convex functions:

- `ownerDashboard:getMyListings`
- `ownerDashboard:getListingDashboard`
- `ownerDashboard:getListingInteractionSummary`
- `ownerDashboard:getListingRecentInteractions`
- `ownerDashboard:getListingLeadDigest`
- `ownerDashboard:getListingImprovementSuggestions`
- `ownerDashboard:getListingProfileCompleteness`
- `ownerDashboard:updateListingPublicProfile`
- `ownerDashboard:requestListingImprovementSuggestions`
- `ownerDashboard:requestListingLeadDigest`

Owner media editor:

- Listing owners manage public listing media at `/dashboard/listings/[id]/media`.
- Allowed owner media types are `LOGO`, `COVER`, `GALLERY`, and `PORTFOLIO`.
- Verification documents are stored separately in `verificationDocuments`; owners cannot upload, view, edit, delete, or reorder them from the media dashboard.
- Owner media mutations are listing-scoped. Owners can manage only their own listings; admins can manage any listing through the same guarded Convex functions.
- Public listing profiles and public MCP discovery expose media URLs, captions, sort order, type, and created time only. They do not expose raw Convex storage IDs, verification document records, admin notes, payment state, owner IDs, or private document paths.
- Profile completeness counts logo, cover image, and at least three gallery or portfolio images.
- Deleting owner media removes the `listingMedia` record and attempts Convex storage deletion. If hard storage deletion is unavailable, the metadata is still removed and the response reports that stored file cleanup was not completed.

Remaining media gaps:

- Image resizing and transcoding are not implemented.
- Hard file size and file type enforcement is not complete beyond browser accept hints and storage upload behavior.
- Virus scanning and moderation are not implemented.
- A fullscreen admin media viewer is still pending.

Provider analytics include:

- listing/profile views
- search result appearances
- WhatsApp, phone, email, and website clicks
- quote requests
- 7 day, 30 day, and all-time periods
- recent interaction timeline
- top interaction types

Profile completeness checks:

- has logo
- has cover image
- has at least 3 gallery or portfolio images
- has short description
- has full description
- has services offered
- has location or service area
- has WhatsApp or phone
- has target audience
- has verification status
- has at least one admin-controlled trust signal

Owner-editable public fields:

- `description`
- `shortDescription`
- `servicesOffered`
- `keywords`
- `phone`
- `whatsapp`
- `email`
- `website`
- `serviceArea`
- `languages`
- `priceRange`
- `remoteAvailable`
- `inPersonAvailable`
- `whatsappAvailable`

Protected fields owners cannot edit:

- `verificationStatus`
- `verificationLevel`
- `trustSignals`
- `isFeatured`
- `featuredUntil`
- payment status
- `ownerUserId`
- `sourceApplicationId`
- admin notes
- private verification documents

AI suggestions and lead digests:

- dashboard pages show latest completed `aiJobs` output where available
- owners/admins can queue new listing suggestion and lead digest jobs for listings they can access
- pages fall back to deterministic summaries when AI output is missing or unavailable
- AI output is labeled as a suggestion and does not change verification, payments, or admin decisions

Remaining dashboard gaps:

- no owner media uploader/editor yet
- no provider email digest sending yet
- no self-serve paid upgrade controls yet
- direct Mastra runtime wiring remains future work

## Storage, Media, And Documents

DiasporaJunxion uses Convex file storage for the current media/document layer.

Public media table:

- `listingMedia`
- public types: `LOGO`, `COVER`, `GALLERY`, `PORTFOLIO`, `BUSINESS_PROOF`
- may be connected to an application during review or to a converted listing
- public listing queries return generated public URLs only
- public MCP discovery tools return `logoUrl`, `coverUrl`, `gallery`, and public `media` URLs
- public tools/routes do not return raw storage ids

Private verification document table:

- `verificationDocuments`
- private types: `ID_FRONT`, `ID_BACK`, `SELFIE_WITH_ID`, `BUSINESS_REGISTRATION`, `OTHER`
- admin-only document preview URLs are generated through `verificationDocuments:adminGetDocumentUrl`
- public routes and public MCP tools never return verification documents

Upload flow:

1. Browser asks `/api/storage/upload-url` for a Convex upload URL.
2. Browser uploads the file directly to the Convex upload URL.
3. Browser saves metadata through:
   - `/api/storage/application-media`
   - `/api/storage/listing-media`
   - `/api/storage/verification-document`
4. Convex stores the `storageId`, media/document type, caption/order where applicable, and activity events.

Admin review flow:

1. Admin opens `/admin/applications/[id]`.
2. Public media previews are shown with generated URLs.
3. Verification document previews are shown through admin-only generated URLs.
4. Admin can mark documents `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`, or `NEEDS_RESUBMISSION` with notes.
5. Status changes create `activityEvents`.

Safety boundaries:

- public users never see verification documents
- raw private storage paths are never exposed
- public MCP discovery is public-field limited
- admin document review still requires the temporary admin token until production auth is connected

Remaining storage/media gaps:

- no image resizing/transcoding yet
- no file size/type enforcement beyond UI hints and Convex upload acceptance
- no owner dashboard listing media editor yet
- no fullscreen document viewer beyond safe admin preview links
- no virus scanning or external moderation yet

## Inngest Workflows

Inngest is the durable workflow layer for lifecycle side effects. It is used for retries, delays, scheduled jobs, and AI job execution handoffs. Primary app actions continue even if Inngest is not configured; event sends are non-blocking and log a safe warning when `INNGEST_EVENT_KEY` is missing.

Entrypoints:

- Client: `src/lib/inngest/client.js`
- Events: `src/lib/inngest/events.js`
- Safe sender: `src/lib/inngest/send.js`
- Functions: `src/lib/inngest/functions/lifecycle.js`
- Route: `/api/inngest`

Environment:

- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `INNGEST_BASE_URL` optional
- `APP_BASE_URL` or `PUBLIC_APP_URL` where app URLs are needed

Local dev:

```sh
bun run app:dev
bun run inngest:dev
```

Supported events:

- `directory/application.submitted`
- `directory/application.payment_initiated`
- `directory/payment.succeeded`
- `directory/payment.failed`
- `directory/payment.abandoned`
- `directory/application.under_review`
- `directory/application.needs_resubmission`
- `directory/application.approved`
- `directory/listing.published`
- `directory/media.uploaded`
- `directory/verification_document.uploaded`
- `directory/verification_document.status_changed`
- `directory/listing.viewed`
- `directory/contact.clicked`
- `ai/listing.summary.requested`
- `ai/application.summary.requested`
- `ai/admin.triage.requested`
- `ai/lead.digest.requested`

Workflow functions:

- `onApplicationSubmitted`
- `onPaymentInitiated`
- `onPaymentSucceeded`
- `onPaymentFailed`
- `onApplicationApproved`
- `onVerificationDocumentUploaded`
- `onVerificationDocumentStatusChanged`
- `onListingViewed`
- `onContactClicked`
- `weeklyLeadDigest`
- `dailyAdminTriage`
- `runListingSummaryJob`
- `runApplicationSummaryJob`
- `runAdminTriageJob`
- `runLeadDigestJob`

AI job flow:

1. Lifecycle code queues an `aiJobs` row or emits an AI request event.
2. The Inngest AI function creates or loads the queued job.
3. The job is marked `RUNNING`.
4. Safe source data is loaded from Convex.
5. The AI service calls the configured provider inside an Inngest step.
6. The output is stored on `aiJobs` and the job is marked `COMPLETED`.
7. Provider or source failures are stored as safe `FAILED` errors and do not block primary app flows.

Safety boundaries:

- event payloads are sanitized to IDs and short event metadata
- no private document URLs
- no raw storage IDs
- no Stripe secrets or full provider metadata
- no AI approval/rejection
- no payment-success override
- AI outputs are suggestions only
- AI does not override admin decisions
- `aiJobs` inputs, outputs, and errors are sanitized before storage

If Inngest is not configured, primary user actions continue and `trySendInngestEvent` returns a skipped/missing-config result.

## Local ChatGPT Testing

For stdio-compatible clients, point the MCP client at:

```sh
bun run dev
```

For HTTP tunnel testing:

```sh
MCP_TRANSPORT=http MCP_PORT=8787 bun run dev
ngrok http 8787
```

HTTP helper endpoints:

- `GET /health`
- `GET /tools`
- `POST /call` with `{ "name": "tool_name", "arguments": {} }`

The SvelteKit bridge also exposes:

- `GET /api/mcp`
- `GET /api/mcp?tools=1`
- `POST /api/mcp`

## Available Tools

Core:

- `ping_diasporajunxion`
- `get_mcp_server_status`
- `list_diasporajunxion_tools`

Public discovery:

- `find_diaspora_friendly_services`
- `search_verified_services`
- `recommend_services_for_need`
- `get_listing_profile`
- `compare_service_options`
- `get_contact_options_for_listing`
- `find_relocation_support`
- `find_housing_support`
- `find_transport_help`
- `find_event_services`
- `find_local_errand_help`
- `find_legal_or_immigration_help`

Public discovery tools are for ChatGPT conversations with end users looking for Ghana and diaspora-facing services. They return active public listings, public descriptions, location/service area, verification status, public contact options, media identifiers suitable for public use, and listing profile URLs. They do not return admin notes, payment data, private applicant data, unapproved applications, internal activity, verification documents, or raw private storage paths.

Admin:

- `get_admin_dashboard_summary`
- `get_needs_attention`
- `get_directory_health_summary`
- `get_payment_summary`
- `get_recent_activity`

Applications:

- `list_pending_applications`
- `list_paid_applications_waiting_review`
- `list_applications_needing_resubmission`
- `list_abandoned_payment_applications`
- `get_application_detail`
- `summarize_application_for_review`

Listings:

- `search_directory_listings`
- `get_listing_detail`
- `get_listing_interaction_summary`
- `list_listings_missing_media`
- `list_listings_missing_contact_info`
- `list_featured_listings`
- `list_inactive_listings`

Payments:

- `list_recent_payments`
- `get_payment_detail`
- `list_failed_payments`
- `list_abandoned_payments`
- `summarize_payment_issues`

AI:

- `ai_search_directory`
- `ai_rewrite_directory_search`
- `ai_summarize_application`
- `ai_suggest_application_category`
- `ai_admin_triage_summary`
- `ai_generate_listing_improvement_suggestions`
- `ai_generate_lead_digest`

Public AI tools:

- `ai_search_directory`
- `ai_rewrite_directory_search`

Admin-only AI tools:

- `ai_summarize_application`
- `ai_suggest_application_category`
- `ai_admin_triage_summary`
- `ai_generate_listing_improvement_suggestions`
- `ai_generate_lead_digest`
- `summarize_application_for_review`

Support/debug:

- `get_application_activity`
- `get_listing_activity`
- `get_recent_error_events`
- `get_user_support_context`

Guarded write stubs:

- `add_admin_note_to_application`
- `mark_application_under_review`
- `request_application_resubmission`
- `update_listing_featured_status`
- `update_listing_active_status`

## Safety Boundaries

MCP v1 intentionally does not include:

- delete user
- delete listing
- approve application automatically
- reject application automatically
- mark payment successful manually
- unrestricted SQL/database execution
- arbitrary shell execution
- raw file-system access
- raw Stripe, Convex, or storage secrets
- private verification document storage paths

AI outputs are suggestions. They do not approve, reject, publish, charge, refund, or alter payment state.

## AI Provider Architecture

All model calls go through the provider adapter layer:

- `src/lib/ai/providers/types.js`
- `src/lib/ai/providers/ollamaCloud.js`
- `src/lib/ai/provider.js`
- `src/lib/ai/service.js`

The Ollama Cloud adapter exposes:

- `generateText({ system, prompt, temperature, maxTokens })`
- `generateJson({ system, prompt, schemaHint, temperature, maxTokens })`
- `isConfigured()`
- `getMissingConfig()`

The service layer implements the current agent-compatible functions:

- `rewriteDirectorySearch`
- `summarizeApplicationForReview`
- `generateListingSummary`
- `generateAdminTriageSummary`
- `generateListingImprovementSuggestions`
- `generateLeadDigest`

`src/mcp/clients/mastra.js` is now a Mastra compatibility boundary that maps existing MCP tool names to these service functions. A direct Mastra runtime or HTTP agent endpoint is not wired yet; that is the remaining Mastra setup. The provider adapter is intentionally swappable for local Ollama, OpenAI, or Anthropic later.

Public search uses deterministic filters first. If Ollama search rewrite is configured and succeeds, it can refine intent, category, location, audience, urgency, and remote/in-person preference and returns a small `aiInterpretation` object. If AI is missing or fails, public discovery falls back to deterministic search and never exposes provider prompts or raw responses.

Discovery intents currently used by MCP:

- `RELOCATION`
- `HOUSING`
- `TRANSPORT`
- `EVENT_VENDOR`
- `LEGAL_IMMIGRATION`
- `BUSINESS_SETUP`
- `HEALTH_WELLNESS`
- `HOME_SERVICES`
- `CREATIVE_MEDIA`
- `LOCAL_ERRANDS`
- `TOURISM`
- `EMERGENCY_HELP`
- `GENERAL_SERVICE_SEARCH`

## Backend Functions Needed Next

The MCP registry is shaped around these safe backend functions. The current milestone adds Convex implementations for the primary read paths listed below:

- `adminDashboard:getSummary`
- `adminDashboard:getNeedsAttention`
- `adminDashboard:getDirectoryHealth`
- `adminDashboard:getPaymentSummary`
- `adminDashboard:getRecentActivity`
- `activity:listRecent`
- `activity:getApplicationActivity`
- `activity:getListingActivity`
- `activity:getRecentErrors`
- `activity:getUserSupportContext`
- `applications:listPending`
- `applications:listPaidWaitingReview`
- `applications:listNeedingResubmission`
- `applications:listAbandonedPayments`
- `applications:getById`
- `applications:listForAdmin`
- `listings:search`
- `listings:getById`
- `listings:getBySlug`
- `listings:adminGetById`
- `listings:listMissingMedia`
- `listings:listMissingContactInfo`
- `listings:listFeatured`
- `listings:listInactive`
- `interactions:log`
- `interactions:getListingInteractionSummary`
- `interactions:getTopListings`
- `payments:listRecent`
- `payments:getById`
- `payments:getPaymentByReference`
- `payments:listFailed`
- `payments:listAbandoned`
- `payments:getSummary`
- `aiJobs:createQueued`
- `aiJobs:getQueued`
- `aiJobs:getById`
- `aiJobs:markRunning`
- `aiJobs:markCompleted`
- `aiJobs:markFailed`
- `aiJobs:listRecent`
- `aiJobs:listFailed`
- `ownerDashboard:getMyListings`
- `ownerDashboard:getListingDashboard`
- `ownerDashboard:getListingInteractionSummary`
- `ownerDashboard:getListingRecentInteractions`
- `ownerDashboard:getListingLeadDigest`
- `ownerDashboard:getListingImprovementSuggestions`
- `ownerDashboard:getListingProfileCompleteness`
- `ownerDashboard:updateListingPublicProfile`
- `ownerDashboard:requestListingImprovementSuggestions`
- `ownerDashboard:requestListingLeadDigest`

Backend functions intentionally guarded or pending:

- `applications:adminUpdateApplicationStatus` remains a generic internal mutation; MCP/admin UI use narrower mutations instead.
- `listings:setFeaturedListing` and `listings:setListingActiveStatus` exist, but MCP access remains guarded by explicit confirmation and should be paired with real admin auth before production use.

Mastra-compatible agent names currently mapped:

- `directorySearchAgent`
- `applicationReviewAssistAgent`
- `categoryClassifierAgent`
- `adminTriageAgent`
- `listingSummaryAgent`
- `leadDigestAgent`

Remaining placeholders:

- direct Mastra runtime/HTTP adapter setup
- embeddings and semantic retrieval via `OLLAMA_EMBED_MODEL`
- optional provider adapters for local Ollama, OpenAI, and Anthropic
- `directory/payment.audit.requested`

## Example ChatGPT Prompts

- “Use DiasporaJunxion MCP and tell me what needs attention today.”
- “Use DiasporaJunxion to find verified relocation help in Accra.”
- “Find me a diaspora-friendly driver in Ghana.”
- “Search for trusted housing support near East Legon.”
- “Compare verified event service providers in Accra.”
- “List paid applications waiting for review.”
- “Summarize application APPLICATION_ID for admin review.”
- “Search listings for diaspora-friendly housing help in Accra.”
- “Show listings missing photos.”
- “Which listings got the most WhatsApp clicks this week?”
- “Generate a lead digest for LISTING_ID.”
## Transactional Email And Notifications

Transactional email uses a swappable adapter in `src/lib/email/provider.js`. The first provider implementation is Resend (`src/lib/email/resend.js`), but auth and workflow code call only the adapter interface:

- `EMAIL_PROVIDER=resend`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `APP_BASE_URL` or `PUBLIC_APP_URL`
- optional `EMAIL_REPLY_TO`

When email config is missing, sends return a structured skipped result with `missingConfig`. Registration, password reset requests, application workflows, payment workflows, and listing workflows continue to work without crashing. Tests mock the provider and never send real email.

Email verification and password reset links use `authTokens` in Convex. The browser receives a raw token only in the emailed link; Convex stores only the SHA-256 `tokenHash`. Tokens expire and are single-use. Password reset responses are neutral and do not reveal whether an email exists. Successful password resets update the existing scrypt password hash and revoke existing sessions.

Lifecycle notifications are routed through Inngest functions. The foundation covers application submitted, payment received, under review, resubmission requested, approved/published, listing published, featured upgrade active, lead digest email, and featured expiry reminders. Email audit events are stored in `activityEvents` with safe metadata only; raw reset/verification tokens and private verification document details are not logged.

Lead digest email support uses the existing digest metrics shape and falls back to a deterministic profile-completeness suggestion when AI output is missing. Featured expiry reminders use a daily Inngest scan for active featured listings expiring soon. Duplicate reminder suppression is not yet persisted; add a reminder marker table or metadata field before enabling high-volume production reminders.

Remaining email gaps:

- Add production scheduler policy and duplicate suppression for featured expiry reminders.
- Expand lifecycle event payloads to include recipient emails everywhere they are emitted.
- Add richer branded HTML once deliverability and provider settings are finalized.
