import { error, redirect } from '@sveltejs/kit';
import { hasAdminRole } from '$lib/server/admin-auth';
import { scopedLogger } from '$lib/utils/logger';

const log = scopedLogger('housing.access');

export function normalizeEmail(email) {
	return email?.trim().toLowerCase() ?? null;
}

function isLegacyAdmin(locals) {
	return hasAdminRole(locals);
}

export function isHousingOperator(locals) {
	return isLegacyAdmin(locals);
}

export function getHousingOperatorEmail(locals) {
	return (
		normalizeEmail(locals.adminAccount?.email) ??
		normalizeEmail(locals.user?.email) ??
		normalizeEmail(locals.supabaseUser?.email)
	);
}

export async function getHousingViewer(locals, { op = 'resolve' } = {}) {
	const authUser = locals.supabaseUser;
	const signedIn = Boolean(authUser?.id);
	const email = normalizeEmail(authUser?.email);
	const isOperator = isHousingOperator(locals);
	const firstName =
		authUser?.user_metadata?.first_name ??
		authUser?.user_metadata?.full_name?.split(' ')?.[0] ??
		authUser?.user_metadata?.name?.split(' ')?.[0] ??
		null;

	const viewer = {
		authConfigured: Boolean(locals.supabaseConfigured),
		signedIn,
		email,
		firstName,
		supabaseUserId: authUser?.id ?? null,
		isOperator
	};

	log.info({
		op,
		phase: 'success',
		signedIn,
		isOperator
	});

	return viewer;
}

export async function requireHousingIdentity(event) {
	if (isHousingOperator(event.locals)) {
		return getHousingViewer(event.locals, { op: 'require_identity_admin' });
	}

	const viewer = await getHousingViewer(event.locals, { op: 'require_identity' });

	if (!viewer.signedIn) {
		throw redirect(
			303,
			`/login?next=${encodeURIComponent(event.url.pathname + (event.url.search || ''))}`
		);
	}

	return viewer;
}

export async function requireOwnerListingAccess(event, listing) {
	const viewer = await requireHousingIdentity(event);

	if (!listing) {
		throw error(404, 'Housing listing not found');
	}

	if (viewer.isOperator || listing.ownerSupabaseUserId === viewer.supabaseUserId) {
		return viewer;
	}

	throw error(404, 'Housing listing not found');
}
