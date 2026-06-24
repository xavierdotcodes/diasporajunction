# DiasporaJunxion MCP

This folder is the ChatGPT-facing control layer for DiasporaJunxion. It exposes a safe MCP server so ChatGPT can inspect directory operations, help admins triage work, and call AI support flows without unrestricted database, filesystem, shell, Stripe, or document-storage access.

The MCP server is read-first. Write tools are present only as guarded interfaces and require explicit `confirm: true`; they must call safe Convex mutations that log `activityEvents`.

## Runtime

- Package root: `diasporajunxion/mcp`
- Entrypoint: `src/mcp/server.js`
- Tool registry: `src/mcp/tools`
- Convex client wrapper: `src/mcp/clients/convex.js`
- Mastra placeholder client: `src/mcp/clients/mastra.js`
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

## Admin Review Guard

Current auth status: this `mcp/` package does not yet have production login/session auth or Convex Auth. It has centralized server auth helpers in `src/lib/server/auth.js` that support:

- `locals.user` when a future SvelteKit auth hook is connected
- a base64url JSON `dj_user` cookie for development/session bridging
- optional trusted dev headers only when `DJ_TRUST_DEV_AUTH_HEADERS=true`
- temporary admin token guard with `DIASPORAJUNXION_ADMIN_TOKEN` or `ADMIN_ACTION_TOKEN`

Until real authentication/authorization is wired and confirmed, admin review actions require:

- `DIASPORAJUNXION_ADMIN_TOKEN` or `ADMIN_ACTION_TOKEN`

Admin actions currently exposed in the simple UI:

- add admin note
- mark under review
- request resubmission with note
- approve and convert application

The UI does not expose rejection, automatic approval, or payment success override.

The temporary token guard remains in place even when an admin user is present. It is centralized and should be replaced by real session/Convex Auth once the production auth provider is chosen.

## Access Matrix

Routes:

- Public: `/directory`, `/directory/ghana`, `/directory/ghana/[category]`, `/directory/[city]`, `/directory/[city]/[category]`, `/directory/profile/[slug]`, `/guides`, `/guides/[slug]`
- Public start: `/apply`
- Application owner or admin: `/apply/[applicationId]`, `/apply/[applicationId]/payment`, `/apply/[applicationId]/success`, `/apply/[applicationId]/cancel`
- Admin only: `/admin`, `/admin/applications`, `/admin/applications/[id]`, `/admin/listings`, `/admin/listings/[id]`

Convex functions:

- Public: `listings:search`, `listings:getBySlug`, `listings:getById` for active listings only, `interactions:log`
- Owner/admin: `applications:getById`, `applications:updateDraft`, `applications:submit`
- Admin: `adminDashboard:*`, `applications:list*`, `applications:admin*`, `listings:admin*`, admin listing maintenance queries, `payments:list*`, `payments:get*`, `activity:*`, interaction summaries
- Webhook only: `payments:markSucceededFromWebhook`, `payments:markFailedFromWebhook`, `payments:markAbandoned`, `payments:handleStripeWebhook`

Payment success remains webhook-only. Client routes can create checkout and mark payment initiated, but they cannot mark payment successful.

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
- `DIASPORAJUNXION_ADMIN_TOKEN` or production admin session auth
- `STRIPE_WEBHOOK_SECRET` for webhook-only payment success mutations

If Convex is not linked locally, do not treat mocked MCP tests as deployment validation. They verify wrapper behavior, not a live Convex deployment.

Remaining auth work:

- connect production session auth or Convex Auth
- replace dev cookie/header support with signed sessions
- map authenticated app users to Convex `users`
- remove temporary admin-token fallback only after admin sessions are confirmed
- add owner dashboard editing screens for limited listing profile fields

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

Inngest is the durable workflow layer for lifecycle side effects. It is used for retries, delays, scheduled jobs, and future AI/Mastra handoffs. Primary app actions should continue even if Inngest is not configured; event sends are non-blocking and log a safe warning when `INNGEST_EVENT_KEY` is missing.

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

Safety boundaries:

- event payloads are sanitized to IDs and short event metadata
- no private document URLs
- no raw storage IDs
- no Stripe secrets or full provider metadata
- no AI approval/rejection
- no payment-success override
- Mastra jobs are queued as placeholders in `aiJobs`; live Mastra/Ollama execution is still future work

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

Public search uses deterministic filters first. If Mastra/Ollama search rewrite is available, it can refine intent, category, location, audience, urgency, and remote/in-person preference. If AI is missing or fails, public discovery still falls back to deterministic search.

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

Backend functions intentionally guarded or pending:

- `applications:adminUpdateApplicationStatus` remains a generic internal mutation; MCP/admin UI use narrower mutations instead.
- `listings:setFeaturedListing` and `listings:setListingActiveStatus` exist, but MCP access remains guarded by explicit confirmation and should be paired with real admin auth before production use.

Mastra agent adapters needed:

- `directorySearchAgent`
- `applicationReviewAssistAgent`
- `categoryClassifierAgent`
- `adminTriageAgent`
- `listingSummaryAgent`
- `leadDigestAgent`

Inngest event wrappers planned:

- `ai/admin.triage.requested`
- `ai/application.summary.requested`
- `ai/lead.digest.requested`
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
