import { json } from '@sveltejs/kit';
import { convexMutation } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

const allowedTypes = new Set([
	'SEARCH_RESULT_SHOWN',
	'LISTING_PROFILE_VIEWED',
	'VIEW',
	'WHATSAPP_CLICK',
	'PHONE_CLICK',
	'EMAIL_CLICK',
	'WEBSITE_CLICK',
	'QUOTE_REQUEST'
]);

export async function POST({ request }) {
	const body = await request.json();
	if (!body.listingId || !allowedTypes.has(body.type)) {
		return json({ ok: false, error: 'Invalid interaction payload.' }, { status: 400 });
	}
	await convexMutation('interactions:log', {
		listingId: body.listingId,
		type: body.type,
		referrer: body.referrer,
		metadata: { source: 'public_route' }
	});
	await trySendInngestEvent(eventNameForInteraction(body.type), {
		listingId: body.listingId,
		interactionType: body.type
	});
	return json({ ok: true });
}

function eventNameForInteraction(type) {
	return ['SEARCH_RESULT_SHOWN', 'LISTING_PROFILE_VIEWED', 'VIEW'].includes(type)
		? INNGEST_EVENTS.LISTING_VIEWED
		: INNGEST_EVENTS.CONTACT_CLICKED;
}
