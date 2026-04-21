import { getStripe } from '$lib/server/stripe';
import { getCommunityViewer, requireCommunityAccess } from '$lib/server/access/community';
import { syncCommunityAccessFromCheckoutSession } from '$lib/server/community/access';
import {
	askConnectEntries,
	accessEntries,
	livedIntelligenceEntries,
	memberBuckets,
	memberWorkspaceLinks,
	pulseEntries,
	resourceVaultItems,
	toolsEntries
} from '$lib/server/community/content';
import { requestLogger, serializeError } from '$lib/utils/logger';

function buildPortalContent() {
	return {
		memberBuckets,
		memberWorkspaceLinks,
		pulseEntries,
		accessEntries,
		livedIntelligenceEntries,
		resourceVaultItems,
		toolsEntries,
		askConnectEntries
	};
}

export async function loadCommunityLanding(event) {
	const log = requestLogger('community.landing.page', event);
	const checkoutSessionId = event.url.searchParams.get('community_session_id');
	const checkoutCanceled = event.url.searchParams.get('checkout') === 'canceled';
	let checkoutResult = null;

	log.info({
		op: 'load',
		phase: 'start',
		path: event.url.pathname,
		hasCheckoutSession: Boolean(checkoutSessionId)
	});

	if (checkoutSessionId) {
		try {
			const stripe = getStripe();
			const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
			const syncResult = await syncCommunityAccessFromCheckoutSession(
				session,
				'community_checkout_return'
			);

			if (syncResult.ok) {
				checkoutResult = {
					status: 'success',
					email: syncResult.email
				};

				log.info({
					op: 'load',
					phase: 'success',
					state: 'checkout_activated',
					emailDomain: syncResult.email?.split('@')[1],
					sessionId: session.id
				});
			}
		} catch (error) {
			log.error({
				op: 'load',
				phase: 'error',
				state: 'checkout_activation_failed',
				sessionId: checkoutSessionId,
				error: serializeError(error)
			});
			checkoutResult = { status: 'error' };
		}
	} else if (checkoutCanceled) {
		checkoutResult = { status: 'canceled' };
	}

	const viewer = await getCommunityViewer(event.locals, { op: 'load' });

	log.info({
		op: 'load',
		phase: 'success',
		state: viewer.state,
		hasCheckoutMessage: Boolean(checkoutResult)
	});

	return {
		communityViewer: viewer,
		checkoutResult
	};
}

export async function loadCommunityPortal(event) {
	const log = requestLogger('community.portal.page', event);

	log.info({
		op: 'load',
		phase: 'start',
		path: event.url.pathname
	});

	const viewer = await requireCommunityAccess(event);
	const portalContent = buildPortalContent();

	log.info({
		op: 'load',
		phase: 'success',
		state: viewer.state,
		bucketCount: portalContent.memberBuckets.length
	});

	return {
		communityViewer: viewer,
		portalContent
	};
}
