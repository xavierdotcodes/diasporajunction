import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { scopedLogger, serializeError } from '$lib/utils/logger';

const log = scopedLogger('access.community');
const memberRoles = new Set(['ADMIN', 'COMMUNITY_MEMBER', 'MEMBER']);

function normalizeEmail(email) {
	return email?.trim().toLowerCase() ?? null;
}

export function getUserRoles(user) {
	return Array.isArray(user?.roles) ? user.roles.map((role) => role.role ?? role) : [];
}

export async function getCommunityViewer(locals, { op = 'resolve' } = {}) {
	const roles = getUserRoles(locals.user);
	const signedIn = Boolean(locals.user?.id);
	const subscribed = Boolean(locals.user?.subscribed);
	const email = normalizeEmail(locals.user?.email);

	log.debug({
		op,
		phase: 'query',
		signedIn,
		emailDomain: email?.split('@')[1]
	});

	let grant = null;

	if (email) {
		try {
			grant = await prisma.communityAccessGrant.findUnique({
				where: { email }
			});
		} catch (error) {
			log.error({
				op,
				phase: 'error',
				emailDomain: email?.split('@')[1],
				error: serializeError(error)
			});
			throw error;
		}
	}

	const hasCommunityAccess =
		roles.some((role) => memberRoles.has(role)) || grant?.status === 'ACTIVE';

	const state = hasCommunityAccess
		? 'member'
		: grant?.status === 'REQUESTED'
			? 'requested'
			: grant?.status === 'REVOKED'
				? 'revoked'
				: signedIn
					? 'authenticated'
					: 'visitor';

	const viewer = {
		signedIn,
		subscribed,
		roles,
		hasCommunityAccess,
		state,
		grantStatus: grant?.status ?? null,
		email
	};

	log.info({
		op,
		phase: 'success',
		state: viewer.state,
		hasCommunityAccess: viewer.hasCommunityAccess,
		signedIn
	});

	return viewer;
}

export async function requireCommunityAccess(event, { redirectTo = '/community' } = {}) {
	const viewer = await getCommunityViewer(event.locals, { op: 'guard' });

	if (!viewer.signedIn) {
		log.warn({
			op: 'guard',
			phase: 'redirect',
			reason: 'unauthenticated',
			path: event.url.pathname
		});
		throw redirect(303, redirectTo);
	}

	if (!viewer.hasCommunityAccess) {
		log.warn({
			op: 'guard',
			phase: 'redirect',
			reason: 'missing_access',
			path: event.url.pathname,
			state: viewer.state
		});
		throw redirect(303, redirectTo);
	}

	return viewer;
}
