// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmailProvider, sendEmail } from '../src/lib/email/provider.js';
import { createResendProvider } from '../src/lib/email/resend.js';
import { featuredExpiryTemplate, leadDigestTemplate, lifecycleTemplate } from '../src/lib/email/templates.js';
import { createRawAuthToken, hashAuthToken } from '../src/lib/server/email/tokens.js';

describe('email provider adapter', () => {
	it('skips safely when Resend config is missing', async () => {
		const provider = createEmailProvider({});
		expect(provider.isConfigured()).toBe(false);
		const result = await sendEmail({ to: 'a@example.com', subject: 'Hi', text: 'Hi', html: '<p>Hi</p>' }, { provider });
		expect(result).toMatchObject({
			ok: false,
			skipped: true,
			reason: 'missing_config',
			missingConfig: ['RESEND_API_KEY', 'EMAIL_FROM']
		});
	});

	it('sends the expected Resend request shape with a mocked fetch', async () => {
		const fetchImpl = vi.fn(async () => ({
			ok: true,
			json: async () => ({ id: 'email_123' })
		}));
		const provider = createResendProvider(
			{
				RESEND_API_KEY: 'secret',
				EMAIL_FROM: 'Diaspora Junxion <hello@example.com>',
				EMAIL_REPLY_TO: 'support@example.com'
			},
			fetchImpl
		);
		const result = await provider.sendEmail({
			to: 'owner@example.com',
			subject: 'Subject',
			html: '<p>Hello</p>',
			text: 'Hello',
			tags: { type: 'test' }
		});
		expect(result).toEqual({ ok: true, provider: 'resend', id: 'email_123' });
		expect(fetchImpl).toHaveBeenCalledWith(
			'https://api.resend.com/emails',
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({ authorization: 'Bearer secret' })
			})
		);
		const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
		expect(body).toMatchObject({
			from: 'Diaspora Junxion <hello@example.com>',
			to: ['owner@example.com'],
			reply_to: 'support@example.com',
			subject: 'Subject',
			tags: [{ name: 'type', value: 'test' }]
		});
	});
});

describe('auth token helpers', () => {
	it('hashes raw tokens and never stores the raw value as the hash', () => {
		const token = createRawAuthToken();
		const hash = hashAuthToken(token);
		expect(hash).not.toBe(token);
		expect(hashAuthToken(token)).toBe(hash);
		expect(hash.length).toBeGreaterThan(20);
	});
});

describe('auth email orchestration', () => {
	beforeEach(() => {
		vi.resetModules();
		process.env.CONVEX_INTERNAL_AUTH_SECRET = 'internal-secret';
	});

	it('returns a neutral password reset response for unknown emails', async () => {
		vi.doMock('../src/lib/server/convex.js', () => ({
			convexQuery: vi.fn(async () => null),
			convexMutation: vi.fn()
		}));
		vi.doMock('../src/lib/email/provider.js', () => ({ sendEmail: vi.fn() }));
		const { requestPasswordResetForEmail } = await import('../src/lib/server/email/authEmails.js');
		await expect(requestPasswordResetForEmail('missing@example.com')).resolves.toEqual({
			ok: true,
			neutral: true
		});
	});

	it('logs safe metadata for verification sends and does not log raw tokens', async () => {
		const mutations = [];
		vi.doMock('../src/lib/server/convex.js', () => ({
			convexQuery: vi.fn(),
			convexMutation: vi.fn(async (name, args) => {
				mutations.push({ name, args });
				return 'id';
			})
		}));
		vi.doMock('../src/lib/email/provider.js', () => ({
			sendEmail: vi.fn(async () => ({ ok: true, provider: 'mock', id: 'email_1' }))
		}));
		const { sendEmailVerificationForUser } = await import('../src/lib/server/email/authEmails.js');
		await sendEmailVerificationForUser({ id: 'user_1', email: 'user@example.com', name: 'User' }, { APP_BASE_URL: 'https://example.com' });
		const tokenCreate = mutations.find((call) => call.name === 'authTokens:create');
		const activity = mutations.find((call) => call.name === 'emailActivity:log');
		expect(tokenCreate.args.tokenHash).not.toContain('https://example.com/auth/verify-email');
		expect(JSON.stringify(activity.args)).not.toContain('token=');
		expect(activity.args).toMatchObject({
			eventType: 'EMAIL_VERIFICATION_SENT',
			entityType: 'user',
			entityId: 'user_1'
		});
	});
});

describe('notification templates', () => {
	it('does not expose verification document fields in lifecycle emails', () => {
		const template = lifecycleTemplate({
			subject: 'Application approved',
			title: 'Approved',
			lines: ['Your listing is approved.'],
			privateVerificationDocumentUrl: 'https://private.example/doc.png'
		});
		expect(template.html).not.toContain('private.example');
		expect(template.text).not.toContain('private.example');
	});

	it('uses a deterministic lead digest fallback suggestion', () => {
		const template = leadDigestTemplate({
			listingName: 'Test Listing',
			period: 'Last 7 days',
			metrics: { views: 5 },
			dashboardUrl: 'https://example.com/dashboard'
		});
		expect(template.text).toContain('Keep your profile complete and current.');
		expect(template.text).toContain('Views: 5');
	});

	it('builds a featured expiry reminder', () => {
		const template = featuredExpiryTemplate({
			listingName: 'Featured Listing',
			expiresAt: Date.UTC(2026, 0, 2),
			dashboardUrl: 'https://example.com/dashboard/listings/1'
		});
		expect(template.subject).toContain('Featured Listing');
		expect(template.text).toContain('expiring soon');
	});
});
