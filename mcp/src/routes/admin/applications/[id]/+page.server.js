import { redirect } from '@sveltejs/kit';
import { adminAuthContextForConvex, guardedAdminAction } from '$lib/server/auth.js';
import { convexMutation, convexQuery, withAuth } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export async function load(event) {
	const auth = adminAuthContextForConvex(event);
	const application = await convexQuery('applications:getById', withAuth({ applicationId: event.params.id }, auth));
	const media = await convexQuery('media:listApplicationMedia', withAuth({ applicationId: event.params.id }, auth));
	const documents = await convexQuery(
		'verificationDocuments:listForApplication',
		withAuth({ applicationId: event.params.id }, auth)
	);
	const documentPreviews = await Promise.all(
		documents.map((document) =>
			convexQuery('verificationDocuments:adminGetDocumentUrl', withAuth({ documentId: document.id }, auth))
		)
	);
	return { application, media, documents: documentPreviews };
}

export const actions = {
	note: async ({ request, params }) => guardedAdminAction(request, async (form, auth) => {
		await convexMutation('applications:adminAddNote', {
			applicationId: params.id,
			adminNotes: String(form.get('adminNotes') ?? ''),
			auth
		});
	}),
	underReview: async ({ request, params }) => guardedAdminAction(request, async (_form, auth) => {
		await convexMutation('applications:adminMarkUnderReview', { applicationId: params.id, auth });
		await trySendInngestEvent(INNGEST_EVENTS.APPLICATION_UNDER_REVIEW, { applicationId: params.id });
	}),
	resubmission: async ({ request, params }) => guardedAdminAction(request, async (form, auth) => {
		await convexMutation('applications:adminRequestResubmission', {
			applicationId: params.id,
			adminNotes: String(form.get('adminNotes') ?? ''),
			auth
		});
		await trySendInngestEvent(INNGEST_EVENTS.APPLICATION_NEEDS_RESUBMISSION, { applicationId: params.id });
	}),
	approve: async ({ request, params }) => guardedAdminAction(request, async (_form, auth) => {
		const listingId = await convexMutation('applications:adminApproveAndConvert', { applicationId: params.id, auth });
		await trySendInngestEvent(INNGEST_EVENTS.APPLICATION_APPROVED, { applicationId: params.id, listingId });
		throw redirect(303, '/admin/listings');
	}),
	documentStatus: async ({ request }) => guardedAdminAction(request, async (form, auth) => {
		const documentId = String(form.get('documentId') ?? '');
		const status = String(form.get('status') ?? 'UNDER_REVIEW');
		await convexMutation('verificationDocuments:adminUpdateDocumentStatus', {
			documentId,
			status,
			notes: String(form.get('notes') ?? ''),
			auth
		});
		await trySendInngestEvent(INNGEST_EVENTS.VERIFICATION_DOCUMENT_STATUS_CHANGED, { documentId, status });
	})
};
