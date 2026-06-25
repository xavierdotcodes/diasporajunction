// @ts-nocheck
import { fail, missingConfig, notImplemented } from '../response.js';

const FUNCTION_MAP = {
	get_admin_dashboard_summary: 'adminDashboard:getSummary',
	get_needs_attention: 'adminDashboard:getNeedsAttention',
	get_directory_health_summary: 'adminDashboard:getDirectoryHealth',
	get_payment_summary: 'adminDashboard:getPaymentSummary',
	get_recent_activity: 'adminDashboard:getRecentActivity',
	list_pending_applications: 'applications:listPending',
	list_paid_applications_waiting_review: 'applications:listPaidWaitingReview',
	list_applications_needing_resubmission: 'applications:listNeedingResubmission',
	list_abandoned_payment_applications: 'applications:listAbandonedPayments',
	get_application_detail: 'applications:getById',
	get_application_verification_documents: 'verificationDocuments:listForApplication',
	search_directory_listings: 'listings:search',
	get_listing_detail: 'listings:adminGetById',
	get_listing_interaction_summary: 'interactions:getListingInteractionSummary',
	list_listings_missing_media: 'listings:listMissingMedia',
	list_listings_missing_contact_info: 'listings:listMissingContactInfo',
	list_featured_listings: 'listings:listFeatured',
	list_inactive_listings: 'listings:listInactive',
	list_recent_payments: 'payments:listRecent',
	get_payment_detail: 'payments:getPaymentByReference',
	list_failed_payments: 'payments:listFailed',
	list_abandoned_payments: 'payments:listAbandoned',
	get_application_activity: 'activity:getApplicationActivity',
	get_listing_activity: 'activity:getListingActivity',
	get_recent_error_events: 'activity:getRecentErrors',
	get_user_support_context: 'activity:getUserSupportContext',
	public_search_directory: 'listings:search',
	public_get_listing_profile: 'listings:getById',
	public_get_listing_by_slug: 'listings:getBySlug',
	add_admin_note_to_application: 'applications:adminAddNote',
	mark_application_under_review: 'applications:adminMarkUnderReview',
	request_application_resubmission: 'applications:adminRequestResubmission',
	update_listing_featured_status: 'listings:setFeaturedListing',
	update_listing_active_status: 'listings:setListingActiveStatus'
};

const ADMIN_TOOL_NAMES = new Set([
	'get_admin_dashboard_summary',
	'get_needs_attention',
	'get_directory_health_summary',
	'get_payment_summary',
	'get_recent_activity',
	'list_pending_applications',
	'list_paid_applications_waiting_review',
	'list_applications_needing_resubmission',
	'list_abandoned_payment_applications',
	'get_application_detail',
	'get_application_verification_documents',
	'get_listing_detail',
	'get_listing_interaction_summary',
	'list_listings_missing_media',
	'list_listings_missing_contact_info',
	'list_featured_listings',
	'list_inactive_listings',
	'list_recent_payments',
	'get_payment_detail',
	'list_failed_payments',
	'list_abandoned_payments',
	'get_application_activity',
	'get_listing_activity',
	'get_recent_error_events',
	'get_user_support_context',
	'add_admin_note_to_application',
	'mark_application_under_review',
	'request_application_resubmission',
	'update_listing_featured_status',
	'update_listing_active_status'
]);

export function createConvexClient(config) {
	async function call(functionName, args = {}, kind = 'query') {
		if (config.convexExecutor) {
			return await config.convexExecutor({ functionName, args, kind });
		}
		if (!config.convexUrl) {
			return missingConfig('Convex is not configured for MCP.', ['CONVEX_URL']);
		}

		let ConvexHttpClient;
		try {
			({ ConvexHttpClient } = await import('convex/browser'));
		} catch {
			return notImplemented('Convex client package is not installed or generated yet.', {
				backendFunction: functionName
			});
		}

		try {
			const client = new ConvexHttpClient(config.convexUrl);
			let makeFunctionReference;
			try {
				({ makeFunctionReference } = await import('convex/server'));
			} catch {
				makeFunctionReference = (name) => name;
			}
			if (config.convexAdminKey && typeof client.setAdminAuth === 'function') {
				client.setAdminAuth(config.convexAdminKey);
			}
			const fnRef = makeFunctionReference(functionName);
			const data = kind === 'mutation' ? await client.mutation(fnRef, args) : await client.query(fnRef, args);
			return { ok: true, data, message: 'Convex function completed.', missingConfig: [], notImplemented: false };
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Convex call failed.';
			const missingFunction =
				message.includes('Could not find public function') || message.includes('not found');
			return {
				ok: false,
				error: message,
				message: missingFunction ? `Missing Convex backend function: ${functionName}` : 'Convex call failed.',
				missingConfig: [],
				notImplemented: missingFunction,
				data: { backendFunction: functionName }
			};
		}
	}

	return {
		functionForTool(toolName) {
			return FUNCTION_MAP[toolName];
		},
		queryForTool(toolName, args = {}) {
			const fn = FUNCTION_MAP[toolName];
			if (!fn) return notImplemented('No Convex backend function is mapped for this MCP tool.');
			const argsWithAuth = withToolAuth(toolName, args, config);
			if (argsWithAuth.__authError) return argsWithAuth.__authError;
			return call(fn, argsWithAuth, 'query');
		},
		mutationForTool(toolName, args = {}) {
			const fn = FUNCTION_MAP[toolName];
			if (!fn) return notImplemented('No Convex backend mutation is mapped for this MCP tool.');
			const argsWithAuth = withToolAuth(toolName, args, config);
			if (argsWithAuth.__authError) return argsWithAuth.__authError;
			return call(fn, argsWithAuth, 'mutation');
		}
	};
}

function withToolAuth(toolName, args, config) {
	if (!ADMIN_TOOL_NAMES.has(toolName)) return args;
	if (args.auth) return args;
	if (config.requestAuth?.role === 'ADMIN') {
		return {
			...args,
			auth: {
				userId: config.requestAuth.userId,
				role: 'ADMIN'
			}
		};
	}
	if (!config.appAdminToken) {
		return {
			...args,
			auth: undefined,
			__authError: fail('Admin authorization is required for private MCP tools.', {
				missingConfig: ['DIASPORAJUNXION_ADMIN_TOKEN']
			})
		};
	}
	return {
		...args,
		auth: {
			role: config.appAdminToken ? 'ADMIN' : undefined,
			adminToken: config.appAdminToken || undefined
		}
	};
}
