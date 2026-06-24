import { describe, expect, it } from 'vitest';
import { INNGEST_EVENTS, assertSafeEventPayload, safeEventPayload } from '../src/lib/inngest/events.js';
import { sendInngestEvent } from '../src/lib/inngest/send.js';
import {
	applicationApprovedFollowUps,
	leadDigestEventsForTopListings,
	paymentSucceededFollowUps,
	shouldMarkPaymentAbandoned
} from '../src/lib/inngest/functions/lifecycle.js';

describe('inngest event safety', () => {
	it('defines lifecycle event names', () => {
		expect(INNGEST_EVENTS.APPLICATION_SUBMITTED).toBe('directory/application.submitted');
		expect(INNGEST_EVENTS.PAYMENT_SUCCEEDED).toBe('directory/payment.succeeded');
		expect(INNGEST_EVENTS.AI_LEAD_DIGEST_REQUESTED).toBe('ai/lead.digest.requested');
	});

	it('redacts event payloads to safe fields', () => {
		const payload = safeEventPayload({
			applicationId: 'app1',
			listingId: 'listing1',
			documentUrl: 'https://private.example/doc',
			storageId: 'raw-storage',
			adminNotes: 'private',
			providerMetadata: { secret: true },
			reference: 'dj-ref'
		});
		expect(payload).toEqual({ applicationId: 'app1', listingId: 'listing1', reference: 'dj-ref' });
		expect(() => assertSafeEventPayload(payload)).not.toThrow();
		expect(() => assertSafeEventPayload({ documentUrl: 'https://private.example/doc' })).toThrow(/Unsafe/);
	});

	it('missing Inngest config does not need to break primary flow', async () => {
		const previous = process.env.INNGEST_EVENT_KEY;
		delete process.env.INNGEST_EVENT_KEY;
		await expect(
			sendInngestEvent(INNGEST_EVENTS.APPLICATION_SUBMITTED, { applicationId: 'app1' }, { allowMissingConfig: true })
		).resolves.toMatchObject({ ok: true, skipped: true, missingConfig: ['INNGEST_EVENT_KEY'] });
		if (previous === undefined) delete process.env.INNGEST_EVENT_KEY;
		else process.env.INNGEST_EVENT_KEY = previous;
	});
});

describe('inngest workflow planning', () => {
	it('marks only pending or initiated payments as abandoned', () => {
		expect(shouldMarkPaymentAbandoned({ status: 'PENDING' })).toBe(true);
		expect(shouldMarkPaymentAbandoned({ status: 'INITIATED' })).toBe(true);
		expect(shouldMarkPaymentAbandoned({ status: 'SUCCESS' })).toBe(false);
	});

	it('plans payment succeeded follow-up events', () => {
		expect(paymentSucceededFollowUps({ applicationId: 'app1' })).toEqual([
			{ name: INNGEST_EVENTS.AI_APPLICATION_SUMMARY_REQUESTED, data: { applicationId: 'app1' } }
		]);
	});

	it('plans application approved follow-up events', () => {
		expect(applicationApprovedFollowUps({ applicationId: 'app1', listingId: 'listing1' })).toEqual([
			{ name: INNGEST_EVENTS.LISTING_PUBLISHED, data: { applicationId: 'app1', listingId: 'listing1' } },
			{ name: INNGEST_EVENTS.AI_LISTING_SUMMARY_REQUESTED, data: { listingId: 'listing1' } }
		]);
	});

	it('plans weekly lead digest placeholder events', () => {
		expect(leadDigestEventsForTopListings([{ listingId: 'listing1', type: 'WHATSAPP_CLICK' }])).toEqual([
			{
				name: INNGEST_EVENTS.AI_LEAD_DIGEST_REQUESTED,
				data: { listingId: 'listing1', interactionType: 'WHATSAPP_CLICK' }
			}
		]);
	});
});
