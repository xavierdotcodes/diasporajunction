// @ts-nocheck
import { fail } from '@sveltejs/kit';
import { authContextForConvex, requireUser } from '$lib/server/auth.js';
import { convexMutation, convexQuery, withAuth } from '$lib/server/convex.js';

export async function load(event) {
	requireUser(event);
	const auth = authContextForConvex(event);
	return {
		dashboard: await convexQuery('ownerDashboard:getListingDashboard', withAuth({ listingId: event.params.id }, auth))
	};
}

export const actions = {
	default: async (event) => {
		requireUser(event);
		const form = await event.request.formData();
		const auth = authContextForConvex(event);
		const patch = {
			description: text(form, 'description'),
			shortDescription: text(form, 'shortDescription'),
			servicesOffered: csv(form, 'servicesOffered'),
			keywords: csv(form, 'keywords'),
			phone: text(form, 'phone'),
			whatsapp: text(form, 'whatsapp'),
			email: text(form, 'email'),
			website: text(form, 'website'),
			serviceArea: text(form, 'serviceArea'),
			languages: csv(form, 'languages'),
			priceRange: text(form, 'priceRange'),
			remoteAvailable: form.get('remoteAvailable') === 'on',
			inPersonAvailable: form.get('inPersonAvailable') === 'on',
			whatsappAvailable: form.get('whatsappAvailable') === 'on'
		};
		try {
			await convexMutation('ownerDashboard:updateListingPublicProfile', withAuth({ listingId: event.params.id, patch }, auth));
			return { ok: true, message: 'Listing profile updated.' };
		} catch (error) {
			return fail(400, { message: error instanceof Error ? error.message : 'Listing update failed.' });
		}
	}
};

function text(form, key) {
	return String(form.get(key) ?? '').trim();
}

function csv(form, key) {
	return text(form, key)
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}
