// @ts-nocheck
import { convexMutation, convexQuery } from '$lib/server/convex.js';
import { hashPassword, internalAuthSecret, normalizeEmail } from '$lib/server/sessionAuth.js';
import { sendEmail } from '$lib/email/provider.js';
import { emailVerificationTemplate, passwordResetTemplate } from '$lib/email/templates.js';
import { AUTH_TOKEN_TYPES, createRawAuthToken, hashAuthToken, tokenExpiry } from './tokens.js';

const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24;
const PASSWORD_RESET_TTL_MS = 1000 * 60 * 60;

function appBaseUrl(env = process.env) {
	return (env.APP_BASE_URL || env.PUBLIC_APP_URL || 'http://localhost:5173').replace(/\/$/, '');
}

function safeUserId(user) {
	return user?._id || user?.id || user?.userId;
}

async function logEmail(eventType, { userId, entityType, entityId, metadata = {} } = {}) {
	try {
		await convexMutation('emailActivity:log', {
			eventType,
			actorUserId: userId,
			entityType,
			entityId,
			metadata,
			internalAuthSecret: internalAuthSecret()
		});
	} catch {
		// Email audit logging must not break primary auth flows.
	}
}

async function issueAuthToken({ userId, type, ttlMs, metadata }) {
	const rawToken = createRawAuthToken();
	await convexMutation('authTokens:create', {
		userId,
		type,
		tokenHash: hashAuthToken(rawToken),
		expiresAt: tokenExpiry(ttlMs),
		metadata,
		internalAuthSecret: internalAuthSecret()
	});
	return rawToken;
}

async function sendAndLog({ message, successEventType, userId, entityType, entityId, metadata }) {
	const result = await sendEmail(message);
	if (result.skipped && result.reason === 'missing_config') {
		await logEmail('EMAIL_SKIPPED_MISSING_CONFIG', {
			userId,
			entityType,
			entityId,
			metadata: { purpose: metadata?.purpose, missingConfig: result.missingConfig }
		});
		return result;
	}
	if (!result.ok) {
		await logEmail('EMAIL_FAILED', {
			userId,
			entityType,
			entityId,
			metadata: { purpose: metadata?.purpose, provider: result.provider, status: result.status }
		});
		return result;
	}
	await logEmail(successEventType, {
		userId,
		entityType,
		entityId,
		metadata: { purpose: metadata?.purpose, provider: result.provider, providerMessageId: result.id }
	});
	return result;
}

export async function sendEmailVerificationForUser(user, env = process.env) {
	const userId = safeUserId(user);
	if (!userId || !user?.email) return { ok: false, skipped: true, reason: 'missing_user' };
	const rawToken = await issueAuthToken({
		userId,
		type: AUTH_TOKEN_TYPES.EMAIL_VERIFICATION,
		ttlMs: EMAIL_VERIFICATION_TTL_MS,
		metadata: { purpose: 'email_verification' }
	});
	const verificationUrl = `${appBaseUrl(env)}/auth/verify-email?token=${encodeURIComponent(rawToken)}`;
	const template = emailVerificationTemplate({ name: user.name, verificationUrl, expiresHours: 24 });
	return await sendAndLog({
		message: {
			to: user.email,
			...template,
			tags: { type: 'email_verification' },
			metadata: { userId }
		},
		successEventType: 'EMAIL_VERIFICATION_SENT',
		userId,
		entityType: 'user',
		entityId: String(userId),
		metadata: { purpose: 'email_verification' }
	});
}

export async function requestPasswordResetForEmail(email, env = process.env) {
	const normalizedEmail = normalizeEmail(email);
	if (!normalizedEmail) return { ok: true, neutral: true };
	const user = await convexQuery('users:getByEmailForLogin', {
		email: normalizedEmail,
		internalAuthSecret: internalAuthSecret()
	});
	if (!user) return { ok: true, neutral: true };
	const userId = safeUserId(user);
	const rawToken = await issueAuthToken({
		userId,
		type: AUTH_TOKEN_TYPES.PASSWORD_RESET,
		ttlMs: PASSWORD_RESET_TTL_MS,
		metadata: { purpose: 'password_reset' }
	});
	const resetUrl = `${appBaseUrl(env)}/auth/reset-password?token=${encodeURIComponent(rawToken)}`;
	const template = passwordResetTemplate({ name: user.name, resetUrl, expiresMinutes: 60 });
	await sendAndLog({
		message: {
			to: user.email,
			...template,
			tags: { type: 'password_reset' },
			metadata: { userId }
		},
		successEventType: 'PASSWORD_RESET_SENT',
		userId,
		entityType: 'user',
		entityId: String(userId),
		metadata: { purpose: 'password_reset' }
	});
	return { ok: true, neutral: true };
}

export async function confirmEmailVerificationToken(rawToken) {
	if (!rawToken) return { ok: false, reason: 'invalid' };
	const result = await convexMutation('authTokens:consume', {
		tokenHash: hashAuthToken(rawToken),
		type: AUTH_TOKEN_TYPES.EMAIL_VERIFICATION,
		internalAuthSecret: internalAuthSecret()
	});
	if (!result?.ok) return result || { ok: false, reason: 'invalid' };
	await convexMutation('users:markEmailVerified', {
		userId: result.userId,
		internalAuthSecret: internalAuthSecret()
	});
	return { ok: true };
}

export async function resetPasswordWithToken(rawToken, password) {
	if (!rawToken) return { ok: false, reason: 'invalid' };
	if (typeof password !== 'string' || password.length < 8 || password.length > 120) {
		return { ok: false, reason: 'weak_password' };
	}
	const result = await convexMutation('authTokens:consume', {
		tokenHash: hashAuthToken(rawToken),
		type: AUTH_TOKEN_TYPES.PASSWORD_RESET,
		internalAuthSecret: internalAuthSecret()
	});
	if (!result?.ok) return result || { ok: false, reason: 'invalid' };
	await convexMutation('users:updatePasswordAndRevokeSessions', {
		userId: result.userId,
		passwordHash: hashPassword(password),
		internalAuthSecret: internalAuthSecret()
	});
	return { ok: true };
}
