// @ts-nocheck
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { convexMutation, convexQuery } from './convex.js';

export const SESSION_COOKIE_NAME = 'dj_mcp_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

const scrypt = promisify(crypto.scrypt);
const PASSWORD_HASH_PREFIX = 'scrypt';

export function normalizeEmail(email) {
	return String(email ?? '').trim().toLowerCase();
}

export function sessionCookieOptions({ production = process.env.NODE_ENV === 'production', maxAge = SESSION_TTL_SECONDS } = {}) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: production,
		maxAge
	};
}

export function clearSessionCookieOptions({ production = process.env.NODE_ENV === 'production' } = {}) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: production,
		maxAge: 0
	};
}

export async function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString('base64url');
	const derived = await scrypt(String(password), salt, 64);
	return `${PASSWORD_HASH_PREFIX}:${salt}:${derived.toString('base64url')}`;
}

export async function verifyPassword(password, storedHash) {
	const [prefix, salt, expected] = String(storedHash ?? '').split(':');
	if (prefix !== PASSWORD_HASH_PREFIX || !salt || !expected) return false;
	const derived = await scrypt(String(password), salt, 64);
	const expectedBuffer = Buffer.from(expected, 'base64url');
	return expectedBuffer.length === derived.length && crypto.timingSafeEqual(expectedBuffer, derived);
}

export function hashSessionToken(token) {
	return crypto.createHash('sha256').update(String(token)).digest('base64url');
}

export function createSessionToken() {
	return crypto.randomBytes(32).toString('base64url');
}

export function internalAuthSecret(env = process.env) {
	return env.MCP_AUTH_INTERNAL_SECRET || env.DIASPORAJUNXION_ADMIN_TOKEN || env.ADMIN_ACTION_TOKEN || '';
}

export async function createUserSession({ userId, env = process.env }) {
	const token = createSessionToken();
	const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
	await convexMutation(
		'users:createSession',
		{ userId, tokenHash: hashSessionToken(token), expiresAt, internalAuthSecret: internalAuthSecret(env) },
		env
	);
	return { token, expiresAt };
}

export async function getSessionUserFromCookie(cookies, env = process.env) {
	const token = cookies?.get?.(SESSION_COOKIE_NAME);
	if (!token) return null;
	return await getSessionUserFromToken(token, env);
}

export async function getSessionUserFromToken(token, env = process.env) {
	if (!token) return null;
	return await convexQuery('users:getCurrentBySessionToken', { tokenHash: hashSessionToken(token) }, env);
}

export async function revokeSessionToken(token, env = process.env) {
	if (!token) return false;
	return await convexMutation('users:revokeSession', { tokenHash: hashSessionToken(token) }, env);
}

export function validateRegistrationInput({ email, password, name }) {
	const normalizedEmail = normalizeEmail(email);
	if (!normalizedEmail || !normalizedEmail.includes('@')) return 'Enter a valid email address.';
	if (String(password ?? '').length < 8) return 'Password must be at least 8 characters.';
	if (String(name ?? '').length > 120) return 'Name is too long.';
	return null;
}
