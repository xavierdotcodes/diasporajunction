import { fail } from '@sveltejs/kit';
import { convexMutation, convexQuery } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export async function load({ params, request }) {
	const listing = await convexQuery('listings:getBySlug', { slug: params.slug });
	if (listing?.id) {
		await convexMutation('interactions:log', {
			listingId: listing.id,
			type: 'LISTING_PROFILE_VIEWED',
			referrer: request.headers.get('referer') ?? undefined,
			metadata: { source: 'listing_profile' }
		});
		await trySendInngestEvent(INNGEST_EVENTS.LISTING_VIEWED, {
			listingId: listing.id,
			interactionType: 'LISTING_PROFILE_VIEWED'
		});
	}
	return { listing };
}

export const actions = {
	contact: async ({ request }) => {
		const form = await request.formData();
		const listingId = String(form.get('listingId') ?? '');
		const type = String(form.get('type') ?? '');
		if (!listingId || !['WHATSAPP_CLICK', 'PHONE_CLICK', 'EMAIL_CLICK', 'WEBSITE_CLICK'].includes(type)) {
			return fail(400, { message: 'Invalid contact action.' });
		}
		await convexMutation('interactions:log', {
			listingId,
			type,
			metadata: { source: 'listing_profile_contact' }
		});
		await trySendInngestEvent(INNGEST_EVENTS.CONTACT_CLICKED, { listingId, interactionType: type });
		return { ok: true };
	}
};
