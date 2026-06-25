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

- Immutable SvelteKit build assets:
  - `Cache-Control: public, max-age=31536000, immutable`
- Static media and site assets:
  - `Cache-Control: public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800`
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

The app also sends baseline security headers from `src/lib/server/security-headers.js`:

- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

Sensitive mutation endpoints are also rate limited at origin with Redis in `src/lib/server/rate-limit.js`. Keep Cloudflare WAF/rate limiting enabled too; the origin limiter is a fallback and gives consistent protection if a request reaches Railway.

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
- `/api/ebook/checkout-session`
- `/api/community/stripe-webhook`
- `/api/ndgo/enroll`
- `/api/tours/reserve`
- all admin mutation endpoints under `/admin/.../+server`

Legacy `space`, `tours`, `ndgo`, and community membership payment endpoints now return `410 Gone`.
See `docs/stripe-transaction-map.md` for the current Stripe surface.

Why:

- lead capture
- contact form
- active Stripe Checkout and webhook fulfillment
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

Create these in order, with bypass rules above cache rules.

### Rule 0: Bypass dynamic and sensitive routes

Expression:

```txt
(http.request.uri.path starts_with "/api/") or
(http.request.uri.path starts_with "/admin") or
(http.request.uri.path starts_with "/ndgo/portal") or
(http.request.uri.path starts_with "/unsubscribe") or
(http.request.uri.path starts_with "/thank-you")
```

Settings:

- Cache eligibility: Bypass cache

### Rule 1: Cache immutable build assets

Expression:

```txt
http.request.uri.path starts_with "/_app/immutable/"
```

Settings:

- Cache eligibility: Eligible for cache
- Edge TTL: one year
- Browser TTL: respect origin

### Rule 2: Cache static media and site assets

Expression:

```txt
(http.request.uri.path starts_with "/images/") or
(http.request.uri.path starts_with "/videos/") or
(http.request.uri.path starts_with "/fonts/") or
(http.request.uri.path starts_with "/favicon") or
(http.request.uri.path eq "/apple-touch-icon.png") or
(http.request.uri.path eq "/site.webmanifest") or
(http.request.uri.path starts_with "/web-app-manifest-")
```

Settings:

- Cache eligibility: Eligible for cache
- Edge TTL: one month
- Browser TTL: respect origin

### Rule 3: Optional HTML caching for public marketing pages

Expression:

```txt
(http.request.uri.path eq "/") or
(http.request.uri.path eq "/start-here") or
(http.request.uri.path eq "/relocate") or
(http.request.uri.path starts_with "/guides") or
(http.request.uri.path eq "/invest") or
(http.request.uri.path eq "/community") or
(http.request.uri.path eq "/about") or
(http.request.uri.path starts_with "/blog") or
(http.request.uri.path eq "/contact") or
(http.request.uri.path eq "/FAQ") or
(http.request.uri.path eq "/founder") or
(http.request.uri.path eq "/support") or
(http.request.uri.path eq "/team") or
(http.request.uri.path eq "/privacy-policy") or
(http.request.uri.path eq "/terms-of-service")
```

Settings:

- Cache eligibility: Eligible for cache
- Edge TTL: respect origin
- Browser TTL: respect origin

Do this only for public pages. Do not apply it globally.

## Recommended Cloudflare Security Rules

Add WAF custom rules or rate limiting rules for public mutation endpoints:

### API mutation rate limit

Expression:

```txt
(http.request.method in {"POST" "PUT" "PATCH" "DELETE"} and http.request.uri.path starts_with "/api/")
```

Suggested action:

- Rate limit or managed challenge after abnormal bursts from the same IP
- Always bypass cache

### Admin hardening

Expression:

```txt
http.request.uri.path starts_with "/admin"
```

Suggested action:

- Bypass cache
- Add a managed challenge for suspicious/bot traffic
- If admin users have stable countries or IPs, add tighter allow/challenge logic

### Lead and checkout protection

Expression:

```txt
(http.request.uri.path eq "/api/leads") or
(http.request.uri.path eq "/api/contact") or
(http.request.uri.path eq "/api/subscribe") or
(http.request.uri.path contains "/checkout-session") or
(http.request.uri.path contains "payment-intent")
```

Suggested action:

- Rate limit by IP
- Consider Managed Challenge when Cloudflare bot score/signals look suspicious
- Add Turnstile to the forms if spam appears despite rate limits

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
