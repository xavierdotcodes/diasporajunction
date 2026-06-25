// @ts-nocheck
import { error, fail } from '@sveltejs/kit';

const ADMIN_TOKEN_NAMES = ['DIASPORAJUNXION_ADMIN_TOKEN', 'ADMIN_ACTION_TOKEN'];

export function getCurrentUser(event) {
	if (event.locals?.user) return normalizeUser(event.locals.user);

	const cookieUser = parseUserCookie(event.cookies?.get('dj_user'));
	if (cookieUser) return cookieUser;

	if (process.env.DJ_TRUST_DEV_AUTH_HEADERS === 'true') {
		const userId = event.request.headers.get('x-dj-user-id');
		const role = event.request.headers.get('x-dj-user-role');
		if (userId && role) {
			return normalizeUser({
				id: userId,
				role,
				email: event.request.headers.get('x-dj-user-email') ?? undefined,
				name: event.request.headers.get('x-dj-user-name') ?? undefined
			});
		}
	}

	return null;
}

export function requireUser(event) {
	const user = getCurrentUser(event);
	if (!user) throw error(401, 'Sign in is required.');
	return user;
}

export function requireAdmin(event) {
	const user = getCurrentUser(event);
	if (user?.role === 'ADMIN') return user;
	const token = getAdminTokenFromEvent(event);
	if (isValidAdminToken(token)) return { id: undefined, role: 'ADMIN', authMode: 'temporary_admin_token' };
	throw error(403, 'Admin authorization is required.');
}

export function requireListingOwnerOrAdmin(event, listing) {
	const user = requireUser(event);
	if (user.role === 'ADMIN' || String(listing?.ownerUserId ?? '') === String(user.id ?? '')) return user;
	throw error(403, 'Listing owner or admin authorization is required.');
}

export function canViewApplication(user, application) {
	if (!application) return false;
	if (!application.applicantUserId) return true;
	return user?.role === 'ADMIN' || String(application.applicantUserId) === String(user?.id ?? '');
}

export function canEditApplication(user, application) {
	if (!canViewApplication(user, application)) return false;
	return ['DRAFT', 'NEEDS_RESUBMISSION'].includes(application.status);
}

export function canAdminReviewApplication(user) {
	return user?.role === 'ADMIN';
}

export function canViewListingOwnerDashboard(user, listing) {
	return user?.role === 'ADMIN' || String(listing?.ownerUserId ?? '') === String(user?.id ?? '');
}

export function canEditListing(user, listing) {
	return canViewListingOwnerDashboard(user, listing);
}

export function requireApplicationAccess(event, application) {
	const user = getCurrentUser(event);
	if (canViewApplication(user, application)) return user;
	throw error(403, 'You are not authorized to view this application.');
}

export function requireApplicationEditAccess(event, application) {
	const user = getCurrentUser(event);
	if (canEditApplication(user, application)) return user;
	throw error(403, 'You are not authorized to edit this application.');
}

export async function guardedAdminAction(request, fn) {
	const event = request?.request ? request : null;
	const realAdmin = event ? getCurrentUser(event) : null;
	const actualRequest = event ? event.request : request;
	const form = await actualRequest.formData();
	const token = String(form.get('adminToken') ?? '');
	const headerOrCookieToken = event ? getAdminTokenFromEvent(event) : '';
	const validFallbackToken = token || headerOrCookieToken;
	if (realAdmin?.role !== 'ADMIN' && !isValidAdminToken(validFallbackToken)) {
		return fail(403, { message: 'Admin action token is required until real auth is implemented.' });
	}
	try {
		const auth =
			realAdmin?.role === 'ADMIN'
				? { userId: realAdmin.id, role: 'ADMIN', authMode: 'session' }
				: { role: 'ADMIN', authMode: 'temporary_admin_token', adminToken: validFallbackToken };
		const result = await fn(form, auth);
		return result ?? { ok: true };
	} catch (err) {
		if (err?.status) throw err;
		return fail(400, { message: err instanceof Error ? err.message : 'Admin action failed.' });
	}
}

export function authContextForConvex(event) {
	const user = getCurrentUser(event);
	const adminToken = getAdminTokenFromEvent(event);
	return compact({
		userId: user?.id,
		role: user?.role,
		adminToken: user?.role === 'ADMIN' ? undefined : isValidAdminToken(adminToken) ? adminToken : undefined
	});
}

export function adminAuthContextForConvex(event) {
	const user = requireAdmin(event);
	return compact({
		userId: user.id,
		role: 'ADMIN',
		adminToken: user.authMode === 'temporary_admin_token' ? getAdminTokenFromEvent(event) : undefined
	});
}

export function webhookContextForConvex() {
	return {
		webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
	};
}

export function assertPaymentWebhookContext(context = {}) {
	if (!process.env.STRIPE_WEBHOOK_SECRET || context.webhookSecret !== process.env.STRIPE_WEBHOOK_SECRET) {
		throw error(403, 'Trusted webhook context is required.');
	}
	return true;
}

export function getAdminTokenFromEvent(event) {
	return (
		event.url?.searchParams.get('adminToken') ||
		event.request.headers.get('x-dj-admin-token') ||
		event.cookies?.get('dj_admin_token') ||
		''
	);
}

export function isValidAdminToken(token, env = process.env) {
	const expected = ADMIN_TOKEN_NAMES.map((name) => env[name]).find(Boolean);
	return Boolean(expected && token && token === expected);
}

function parseUserCookie(value) {
	if (!value) return null;
	try {
		return normalizeUser(JSON.parse(Buffer.from(value, 'base64url').toString('utf8')));
	} catch {
		return null;
	}
}

function normalizeUser(user) {
	if (!user) return null;
	const role = ['USER', 'LISTING_OWNER', 'ADMIN'].includes(user.role) ? user.role : 'USER';
	return {
		id: user.id ?? user._id,
		email: user.email,
		name: user.name,
		role
	};
}

function compact(value) {
	return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));
}
