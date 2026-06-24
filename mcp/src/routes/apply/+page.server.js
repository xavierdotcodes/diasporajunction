import { fail, redirect } from '@sveltejs/kit';
import { convexMutation } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const patch = applicationPatchFromForm(form);
		try {
			const applicationId = await convexMutation('applications:createDraft', { patch });
			await convexMutation('applications:submit', { applicationId });
			await trySendInngestEvent(INNGEST_EVENTS.APPLICATION_SUBMITTED, {
				applicationId,
				eventType: INNGEST_EVENTS.APPLICATION_SUBMITTED
			});
			throw redirect(303, `/apply/${applicationId}/payment`);
		} catch (error) {
			if (error?.status) throw error;
			return fail(400, { message: error instanceof Error ? error.message : 'Application could not be submitted.' });
		}
	}
};

function applicationPatchFromForm(form) {
	return {
		businessName: value(form, 'businessName'),
		contactName: value(form, 'contactName'),
		email: value(form, 'email'),
		phone: value(form, 'phone'),
		whatsapp: value(form, 'whatsapp'),
		website: value(form, 'website'),
		category: value(form, 'category') || 'OTHER',
		customCategory: value(form, 'customCategory'),
		description: value(form, 'description'),
		shortDescription: value(form, 'shortDescription'),
		servicesOffered: csv(form, 'servicesOffered'),
		keywords: csv(form, 'keywords'),
		city: value(form, 'city'),
		region: value(form, 'region'),
		country: value(form, 'country') || 'Ghana',
		serviceArea: value(form, 'serviceArea'),
		targetAudience: value(form, 'targetAudience') || 'BOTH',
		languages: csv(form, 'languages'),
		remoteAvailable: form.get('remoteAvailable') === 'on',
		inPersonAvailable: form.get('inPersonAvailable') !== null,
		whatsappAvailable: form.get('whatsappAvailable') !== null,
		referralCode: value(form, 'referralCode')
	};
}

function value(form, key) {
	return String(form.get(key) ?? '').trim() || undefined;
}

function csv(form, key) {
	return String(form.get(key) ?? '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}
