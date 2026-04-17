# Cloudflare Setup For DiasporaJunxion

This app is a mixed SvelteKit site: public marketing pages, lead capture funnel pages, redirect links, admin/app areas, and dynamic API/payment flows.

The safest Cloudflare setup on Free tier is:

- cache static assets aggressively
- cache selected public HTML pages conservatively
- bypass all dynamic/API/payment/admin/auth-like routes
- avoid blanket "Cache Everything" on the whole site

## What The App Now Sends From Origin

The origin now sends cache headers for HTML and dynamic routes through the SvelteKit server hook.

Current origin behavior:

- Public marketing HTML pages:
  - `Cache-Control: public, max-age=0, s-maxage=600, stale-while-revalidate=86400`
- Semi-cacheable public pages with some server involvement:
  - `Cache-Control: public, max-age=0, s-maxage=120, stale-while-revalidate=600`
- Dynamic endpoints and sensitive flows:
  - `Cache-Control: no-store`
  - plus `Pragma: no-cache` and `Expires: 0`
- Redirect links under `/go/*`:
  - `Cache-Control: public, max-age=0, s-maxage=86400, stale-while-revalidate=604800`

This gives Cloudflare a clear signal without caching forms, APIs, or user-sensitive routes.

## Route Strategy

### Highly cacheable

These should be aggressively cacheable in Cloudflare:

- `/_app/immutable/*`
- `/favicon*`
- `/site.webmanifest`
- `/apple-touch-icon.png`
- `/web-app-manifest-*`
- `/fonts/*`
- `/images/*`
- `/videos/*`
- logos, covers, hero media, and other static files under `static/`

These files are the best Cloudflare cache targets.

### Public HTML that is reasonable to cache carefully

These routes are good candidates for HTML caching with a short TTL:

- `/`
- `/start-here`
- `/relocate`
- `/guides`
- `/invest`
- `/community`
- `/about`
- `/FAQ`
- `/founder`
- `/support`
- `/team`
- `/blog`
- `/blog/[slug]`
- `/contact`
- `/privacy-policy`
- `/terms-of-service`

Current origin policy:

- most of the above: `s-maxage=600`
- blog detail and tours-style semi-dynamic pages: `s-maxage=120`

### Semi-cacheable / carefully cacheable

These are public but should use shorter shared caching:

- `/tours`
- `/blog/[slug]`

Reason:

- they may involve server-side data or content updates that should propagate faster

### Never cache

Bypass Cloudflare cache for these:

- `/api/*`
- `/admin*`
- `/ndgo/portal*`
- `/thank-you`
- `/unsubscribe`

Also bypass all request methods other than `GET` and `HEAD` anywhere possible.

## Routes That Must Bypass Cloudflare Cache

Bypass cache in Cloudflare for:

- `/api/*`
- `/admin*`
- `/ndgo/portal*`
- `/thank-you`
- `/unsubscribe`

Specific dynamic endpoints in this repo include:

- `/api/contact`
- `/api/leads`
- `/api/subscribe`
- `/api/space/create-payment-intent`
- `/api/space/complete-order`
- `/api/space/cancel-payment-intent`
- `/api/ndgo/create-payment-intent`
- `/api/ndgo/complete-enrollment`
- `/api/ndgo/cancel-payment-intent`
- `/api/ndgo/enroll`
- `/api/tours/create-payment-intent`
- `/api/tours/complete-booking`
- `/api/tours/cancel-payment-intent`
- `/api/tours/reserve`
- all admin mutation endpoints under `/admin/.../+server`

Why:

- lead capture
- contact form
- payment intent creation/completion/cancellation
- booking and enrollment flows
- admin mutations
- authenticated portal behavior

Do not cache JSON responses from these routes.

## About `/go/*`

`/go/*` redirect routes are deterministic and safe.

Current origin policy marks them cache-friendly:

- `Cache-Control: public, s-maxage=86400`

You do not need to bypass them.

## Recommended Cloudflare Cache Rules

Use Cache Rules in Cloudflare Free tier.

### Rule 1: Cache immutable build assets

If request URI path starts with:

- `/_app/immutable/`

Then:

- Cache eligibility: Eligible for cache
- Edge TTL: a month or more
- Browser TTL: respect origin or set a long TTL

### Rule 2: Cache static media and site assets

If request URI path starts with any of:

- `/images/`
- `/videos/`
- `/fonts/`

Or matches:

- `/favicon*`
- `/apple-touch-icon.png`
- `/site.webmanifest`
- `/web-app-manifest-*`

Then:

- Cache eligibility: Eligible for cache
- Edge TTL: 1 month or more

### Rule 3: Bypass dynamic routes

If request URI path starts with any of:

- `/api/`
- `/admin`
- `/ndgo/portal`
- `/unsubscribe`
- `/thank-you`

Then:

- Cache eligibility: Bypass cache

### Rule 4: Optional HTML caching for public marketing pages

If request URI path equals or starts with:

- `/`
- `/start-here`
- `/relocate`
- `/guides`
- `/invest`
- `/community`
- `/about`
- `/blog`
- `/contact`
- `/FAQ`
- `/founder`
- `/support`
- `/team`
- `/privacy-policy`
- `/terms-of-service`

Then:

- Cache eligibility: Eligible for cache
- Respect origin cache headers

Do this only for public pages. Do not apply it globally.

## Notes On HTML Caching

Cloudflare does not cache HTML by default.

For this codebase, public marketing pages are reasonable candidates for short HTML caching because:

- they are mostly content pages
- they are not personalized server-side
- they benefit from CDN edge delivery

Be conservative:

- use the selective rule above
- respect origin cache headers
- do not cache admin, portal, API, or form submission routes

## Development Workflow

When shipping content or layout changes:

- temporarily use Cloudflare Development Mode if you need to bypass edge cache during debugging
- avoid repeated full purge spam unless you changed broadly-used assets or HTML cache rules

Use targeted purges when possible:

- purge a specific URL after editing a page with HTML caching
- purge a prefix only if you changed many related pages

## How To Verify After Deploy

Check headers with curl:

```bash
curl -I https://yourdomain.com/start-here
curl -I https://yourdomain.com/api/leads
curl -I https://yourdomain.com/go/li
curl -I https://yourdomain.com/_app/immutable/...
```

What to look for:

- `Cache-Control`
- `CF-Cache-Status`
- `Age`

Expected patterns:

- public pages: `public, max-age=0, s-maxage=...`
- APIs and sensitive routes: `no-store`
- immutable assets: long cache lifetime and ideally `HIT` after warm-up

## Optional Protections

If lead form spam starts showing up:

- add Cloudflare Turnstile to lead capture and contact forms

That is the most practical next step on Free tier.

Also useful:

- monitor bot traffic before adding more complexity
- keep redirect links under `/go/*` simple and server-side as they are now
