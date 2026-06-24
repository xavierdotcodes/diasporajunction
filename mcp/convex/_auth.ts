export type AuthContext = {
	userId?: string;
	role?: 'USER' | 'LISTING_OWNER' | 'ADMIN';
	adminToken?: string;
};

export type WebhookContext = {
	webhookSecret?: string;
};

export function requireAdminAuth(auth?: AuthContext) {
	if (auth?.role === 'ADMIN') return true;
	const expected = process.env.DIASPORAJUNXION_ADMIN_TOKEN || process.env.ADMIN_ACTION_TOKEN;
	if (expected && auth?.adminToken === expected) return true;
	throw new Error('Admin authorization is required.');
}

export function isAdminAuth(auth?: AuthContext) {
	try {
		requireAdminAuth(auth);
		return true;
	} catch {
		return false;
	}
}

export function canViewOwnedRecord(auth: AuthContext | undefined, ownerUserId?: unknown) {
	if (!ownerUserId) return true;
	if (isAdminAuth(auth)) return true;
	return Boolean(auth?.userId && String(auth.userId) === String(ownerUserId));
}

export function requireOwnedRecord(auth: AuthContext | undefined, ownerUserId?: unknown) {
	if (!canViewOwnedRecord(auth, ownerUserId)) throw new Error('Owner or admin authorization is required.');
}

export function requireWebhookAuth(webhook?: WebhookContext) {
	const expected = process.env.STRIPE_WEBHOOK_SECRET;
	if (expected && webhook?.webhookSecret === expected) return true;
	throw new Error('Trusted Stripe webhook context is required.');
}
