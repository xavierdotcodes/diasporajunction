# Stripe Transaction Map

This reflects the current DiasporaJunxion payment surface.

## Active Stripe flows

- Ebook purchase: `/ebook` uses `src/routes/api/ebook/checkout-session` and is fulfilled through `src/routes/api/community/stripe-webhook`.
- Housing owner listing submission fee: `/housing/owners/listings/[id]` uses the `payAndSubmit` action and is fulfilled through `src/routes/api/community/stripe-webhook`.
- MCP directory listing application fee: `mcp/src/routes/apply/[applicationId]/payment` uses the MCP app's Stripe checkout and `mcp/src/routes/api/stripe/webhook`.

## Not currently Stripe-backed

- Community consults currently link to Calendly.
- Tours currently link to Calendly.
- NDGO enrollment is currently a client-side registration modal, not a paid checkout.

## Disabled legacy endpoints

These endpoints return `410 Gone` because they belonged to older PaymentIntent flows and are not wired to the current UI:

- `/api/community/checkout-session`
- `/api/space/create-payment-intent`
- `/api/space/cancel-payment-intent`
- `/api/space/complete-order`
- `/api/tours/create-payment-intent`
- `/api/tours/cancel-payment-intent`
- `/api/tours/complete-booking`
- `/api/ndgo/create-payment-intent`
- `/api/ndgo/cancel-payment-intent`
- `/api/ndgo/complete-enrollment`

The old community checkout component and legacy card PaymentIntent modal were removed so they cannot be accidentally reintroduced without rebuilding the flow intentionally.
