// @ts-nocheck
import { describe, expect, it } from 'vitest';
import {
	authContextForConvex,
	canEditApplication,
	canViewApplication,
	getCurrentUser,
	isValidAdminToken,
	requireAdmin,
	guardedAdminAction,
	webhookContextForConvex
} from '../src/lib/server/auth.js';
import { createConvexClient } from '../src/mcp/clients/convex.js';
import {
	hashPassword,
	sessionCookieOptions,
	verifyPassword
} from '../src/lib/server/sessionAuth.js';

describe('server auth helpers', () => {
	it('detects the temporary admin token without exposing raw checks in routes', () => {
		expect(isValidAdminToken('secret', { DIASPORAJUNXION_ADMIN_TOKEN: 'secret' })).toBe(true);
		expect(isValidAdminToken('wrong', { DIASPORAJUNXION_ADMIN_TOKEN: 'secret' })).toBe(false);
		expect(isValidAdminToken('', { DIASPORAJUNXION_ADMIN_TOKEN: 'secret' })).toBe(false);
	});

	it('reads current user from trusted dev headers only when enabled', () => {
		const event = eventWithHeaders({
			'x-dj-user-id': 'user1',
			'x-dj-user-role': 'ADMIN',
			'x-dj-user-email': 'admin@example.test'
		});
		const previous = process.env.DJ_TRUST_DEV_AUTH_HEADERS;
		process.env.DJ_TRUST_DEV_AUTH_HEADERS = 'true';
		expect(getCurrentUser(event)).toMatchObject({ id: 'user1', role: 'ADMIN' });
		process.env.DJ_TRUST_DEV_AUTH_HEADERS = previous;
	});

	it('builds Convex auth context from admin token query parameter', () => {
		const previous = process.env.DIASPORAJUNXION_ADMIN_TOKEN;
		process.env.DIASPORAJUNXION_ADMIN_TOKEN = 'admin-secret';
		const event = eventWithUrl('https://example.test/admin?adminToken=admin-secret');
		expect(requireAdmin(event)).toMatchObject({ role: 'ADMIN', authMode: 'temporary_admin_token' });
		expect(authContextForConvex(event)).toMatchObject({ adminToken: 'admin-secret' });
		process.env.DIASPORAJUNXION_ADMIN_TOKEN = previous;
	});

	it('checks application owner visibility and edit states', () => {
		const user = { id: 'user1', role: 'LISTING_OWNER' };
		expect(canViewApplication(user, { applicantUserId: 'user1', status: 'DRAFT' })).toBe(true);
		expect(canViewApplication(user, { applicantUserId: 'user2', status: 'DRAFT' })).toBe(false);
		expect(canEditApplication(user, { applicantUserId: 'user1', status: 'DRAFT' })).toBe(true);
		expect(canEditApplication(user, { applicantUserId: 'user1', status: 'PAID' })).toBe(false);
	});

	it('creates webhook context without exposing it through public responses', () => {
		const previous = process.env.STRIPE_WEBHOOK_SECRET;
		process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
		expect(webhookContextForConvex()).toEqual({ webhookSecret: 'whsec_test' });
		process.env.STRIPE_WEBHOOK_SECRET = previous;
	});

	it('hashes passwords and verifies without exposing reversible secrets', async () => {
		const hash = await hashPassword('correct horse battery staple');
		expect(hash).toMatch(/^scrypt:/);
		expect(hash).not.toContain('correct horse');
		await expect(verifyPassword('correct horse battery staple', hash)).resolves.toBe(true);
		await expect(verifyPassword('wrong password', hash)).resolves.toBe(false);
	});

	it('uses secure httpOnly session cookie options in production', () => {
		expect(sessionCookieOptions({ production: true })).toMatchObject({
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			path: '/'
		});
		expect(sessionCookieOptions({ production: false }).secure).toBe(false);
	});

	it('prefers a real admin session for guarded admin actions', async () => {
		const event = eventWithForm({
			locals: { user: { id: 'admin1', role: 'ADMIN', email: 'admin@example.test' } },
			body: new URLSearchParams({ adminNotes: 'Looks good' })
		});
		const result = await guardedAdminAction(event, async (_form, auth) => auth);
		expect(result).toMatchObject({ userId: 'admin1', role: 'ADMIN', authMode: 'session' });
	});

	it('keeps temporary admin token fallback and rejects invalid tokens', async () => {
		const previous = process.env.DIASPORAJUNXION_ADMIN_TOKEN;
		process.env.DIASPORAJUNXION_ADMIN_TOKEN = 'admin-secret';
		const good = eventWithForm({ body: new URLSearchParams({ adminToken: 'admin-secret' }) });
		await expect(guardedAdminAction(good, async (_form, auth) => auth)).resolves.toMatchObject({
			role: 'ADMIN',
			authMode: 'temporary_admin_token'
		});
		const bad = eventWithForm({ body: new URLSearchParams({ adminToken: 'wrong' }) });
		await expect(guardedAdminAction(bad, async () => ({ ok: true }))).resolves.toMatchObject({
			status: 403
		});
		process.env.DIASPORAJUNXION_ADMIN_TOKEN = previous;
	});
});

describe('mcp convex auth injection', () => {
	it('injects admin auth only for admin tools', async () => {
		const calls = [];
		const convex = createConvexClient({
			appAdminToken: 'admin-secret',
			convexExecutor: async (call) => {
				calls.push(call);
				return { ok: true, data: [], message: 'ok', missingConfig: [], notImplemented: false };
			}
		});
		await convex.queryForTool('list_paid_applications_waiting_review', { limit: 1 });
		await convex.queryForTool('public_search_directory', { query: 'driver' });
		expect(calls[0].args.auth).toMatchObject({ role: 'ADMIN', adminToken: 'admin-secret' });
		expect(calls[1].args.auth).toBeUndefined();
	});

	it('allows real admin session auth for private MCP tools', async () => {
		const calls = [];
		const convex = createConvexClient({
			requestAuth: { userId: 'admin1', role: 'ADMIN' },
			convexExecutor: async (call) => {
				calls.push(call);
				return { ok: true, data: [], message: 'ok', missingConfig: [], notImplemented: false };
			}
		});
		await convex.queryForTool('get_admin_dashboard_summary');
		expect(calls[0].args.auth).toEqual({ userId: 'admin1', role: 'ADMIN' });
	});

	it('blocks anonymous private MCP tools without temporary token config', async () => {
		const convex = createConvexClient({
			convexExecutor: async () => {
				throw new Error('should not call convex');
			}
		});
		expect(convex.queryForTool('get_admin_dashboard_summary')).toMatchObject({
			ok: false,
			missingConfig: ['DIASPORAJUNXION_ADMIN_TOKEN']
		});
	});
});

function eventWithHeaders(headers = {}) {
	return {
		locals: {},
		url: new URL('https://example.test/admin'),
		request: new Request('https://example.test/admin', { headers }),
		cookies: { get: () => undefined }
	};
}

function eventWithUrl(url) {
	return {
		locals: {},
		url: new URL(url),
		request: new Request(url),
		cookies: { get: () => undefined }
	};
}

function eventWithForm({ locals = {}, body = new URLSearchParams() } = {}) {
	const request = new Request('https://example.test/admin', {
		method: 'POST',
		body
	});
	return {
		locals,
		url: new URL('https://example.test/admin'),
		request,
		cookies: { get: () => undefined }
	};
}
