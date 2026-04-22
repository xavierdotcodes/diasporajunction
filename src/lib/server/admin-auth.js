import bcrypt from 'bcryptjs';
import prisma from '$lib/server/prisma';
import { scopedLogger, serializeError } from '$lib/utils/logger';

const log = scopedLogger('admin.auth');

export function normalizeAdminEmail(email) {
	return email?.trim().toLowerCase() ?? null;
}

export function hasAdminRole(locals) {
	return Boolean(
		locals.adminAccount ||
			locals.user?.roles?.some((role) => (role.role ?? role) === 'ADMIN')
	);
}

export function getAdminEmail(locals) {
	return normalizeAdminEmail(locals.adminAccount?.email ?? locals.user?.email);
}

export function resolveAdminNext(next) {
	if (typeof next !== 'string') return '/admin/housing';
	if (next === '/admin/login') return '/admin/housing';
	if (!next.startsWith('/admin')) return '/admin/housing';
	return next;
}

export async function authenticateAdminAccount({ email, password }) {
	const normalizedEmail = normalizeAdminEmail(email);
	const normalizedPassword = typeof password === 'string' ? password : '';

	if (!normalizedEmail || !normalizedPassword) {
		return { ok: false, reason: 'missing_credentials' };
	}

	try {
		const adminAccount = await prisma.adminAccount.findUnique({
			where: { email: normalizedEmail }
		});

		if (!adminAccount?.active) {
			return { ok: false, reason: 'invalid_credentials' };
		}

		const valid = await bcrypt.compare(normalizedPassword, adminAccount.passwordHash);

		if (!valid) {
			return { ok: false, reason: 'invalid_credentials' };
		}

		const updatedAdminAccount = await prisma.adminAccount.update({
			where: { id: adminAccount.id },
			data: { lastLoginAt: new Date() }
		});

		log.info({
			op: 'authenticate',
			phase: 'success',
			adminAccountId: updatedAdminAccount.id,
			emailDomain: normalizedEmail.split('@')[1]
		});

		return {
			ok: true,
			adminAccount: updatedAdminAccount
		};
	} catch (error) {
		log.error({
			op: 'authenticate',
			phase: 'error',
			emailDomain: normalizedEmail?.split('@')[1],
			error: serializeError(error)
		});
		return { ok: false, reason: 'error', error };
	}
}
