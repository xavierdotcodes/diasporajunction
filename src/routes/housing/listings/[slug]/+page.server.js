import { fail } from '@sveltejs/kit';
import { createHousingInquiry } from '$lib/server/housing/inquiries';
import { loadHousingListingPage } from '$lib/server/housing/page';
import { getHousingListingBySlug } from '$lib/server/housing/listings';
import { requestLogger, serializeError } from '$lib/utils/logger';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	return loadHousingListingPage(event);
}

export const actions = {
	inquire: async (event) => {
		const log = requestLogger('housing.listing.inquiry.action', event);

		try {
			const data = await event.request.formData();
			const listing = await getHousingListingBySlug(event.params.slug);

			if (!listing || listing.status !== 'PUBLISHED') {
				return fail(404, {
					error: 'Housing listing not found.'
				});
			}

			const requesterName =
				String(data.get('requesterName') || '').trim() ||
				event.locals.supabaseUser?.user_metadata?.first_name ||
				'';
			const requesterEmail =
				String(data.get('requesterEmail') || '').trim() || event.locals.supabaseUser?.email || '';
			const requesterPhone = String(data.get('requesterPhone') || '').trim();
			const moveTimeline = String(data.get('moveTimeline') || '').trim();
			const message = String(data.get('message') || '').trim();
			const values = {
				requesterName,
				requesterEmail,
				requesterPhone,
				moveTimeline,
				message
			};

			if (!requesterEmail) {
				return fail(400, {
					error: 'Please include your email so the inquiry can be followed up.',
					values
				});
			}

			if (!message) {
				return fail(400, {
					error: 'Please tell us what you want to ask about this listing.',
					values
				});
			}

			await createHousingInquiry({
				listing,
				supabaseUser: event.locals.supabaseUser,
				requesterName,
				requesterEmail,
				requesterPhone,
				moveTimeline,
				message
			});

			return {
				success: true,
				values: {
					requesterName: '',
					requesterEmail,
					requesterPhone: '',
					moveTimeline: '',
					message: ''
				}
			};
		} catch (actionError) {
			log.error({
				op: 'inquire',
				phase: 'error',
				error: serializeError(actionError)
			});

			return fail(500, {
				error: 'We could not send your inquiry right now.',
				values: {
					requesterName: String(data.get('requesterName') || '').trim(),
					requesterEmail: String(data.get('requesterEmail') || '').trim(),
					requesterPhone: String(data.get('requesterPhone') || '').trim(),
					moveTimeline: String(data.get('moveTimeline') || '').trim(),
					message: String(data.get('message') || '').trim()
				}
			});
		}
	}
};
