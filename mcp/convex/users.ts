import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { now } from './_shared';
import { requireAdminAuth } from './_auth';

const userRole = v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'));
const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(userRole),
		adminToken: v.optional(v.string())
	})
);

function requireInternalAuth(secret?: string) {
	const expected =
		process.env.MCP_AUTH_INTERNAL_SECRET ||
		process.env.DIASPORAJUNXION_ADMIN_TOKEN ||
		process.env.ADMIN_ACTION_TOKEN;
	if (expected && secret === expected) return true;
	throw new Error('Internal auth context is required.');
}

function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

function publicUser(user: any) {
	if (!user || user.isDeleted) return null;
	return {
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role,
		emailVerifiedAt: user.emailVerifiedAt,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	};
}

export const getByEmail = query({
	args: { email: v.string(), auth: authArg },
	handler: async (ctx, { email, auth }) => {
		requireAdminAuth(auth);
		const user = await ctx.db
			.query('users')
			.withIndex('by_email', (q) => q.eq('email', normalizeEmail(email)))
			.unique();
		return publicUser(user);
	}
});

export const getByEmailForLogin = query({
	args: { email: v.string(), internalAuthSecret: v.string() },
	handler: async (ctx, { email, internalAuthSecret }) => {
		requireInternalAuth(internalAuthSecret);
		const user = await ctx.db
			.query('users')
			.withIndex('by_email', (q) => q.eq('email', normalizeEmail(email)))
			.unique();
		if (!user || user.isDeleted) return null;
		return {
			id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
			passwordHash: user.passwordHash
		};
	}
});

export const getById = query({
	args: { userId: v.id('users'), auth: authArg },
	handler: async (ctx, { userId, auth }) => {
		if (auth?.userId !== String(userId)) requireAdminAuth(auth);
		return publicUser(await ctx.db.get(userId));
	}
});

export const getCurrentBySessionUser = query({
	args: { userId: v.id('users') },
	handler: async (ctx, { userId }) => publicUser(await ctx.db.get(userId))
});

export const createOrUpdateFromAuth = mutation({
	args: {
		email: v.string(),
		name: v.optional(v.string()),
		passwordHash: v.optional(v.string()),
		emailVerifiedAt: v.optional(v.number()),
		internalAuthSecret: v.optional(v.string())
	},
	handler: async (ctx, { email, name, passwordHash, emailVerifiedAt, internalAuthSecret }) => {
		const timestamp = now();
		const normalizedEmail = normalizeEmail(email);
		const existing = await ctx.db
			.query('users')
			.withIndex('by_email', (q) => q.eq('email', normalizedEmail))
			.unique();

		if (existing) {
			requireInternalAuth(internalAuthSecret);
			if (existing.isDeleted) throw new Error('User account is disabled.');
			const patch: Record<string, unknown> = {
				updatedAt: timestamp
			};
			if (name !== undefined) patch.name = name;
			if (passwordHash !== undefined) patch.passwordHash = passwordHash;
			if (emailVerifiedAt !== undefined) patch.emailVerifiedAt = emailVerifiedAt;
			await ctx.db.patch(existing._id, patch);
			return existing._id;
		}

		return await ctx.db.insert('users', {
			email: normalizedEmail,
			name,
			passwordHash,
			role: 'USER',
			isDeleted: false,
			emailVerifiedAt,
			createdAt: timestamp,
			updatedAt: timestamp
		});
	}
});

export const createSession = mutation({
	args: {
		userId: v.id('users'),
		tokenHash: v.string(),
		expiresAt: v.number(),
		internalAuthSecret: v.string()
	},
	handler: async (ctx, { userId, tokenHash, expiresAt, internalAuthSecret }) => {
		requireInternalAuth(internalAuthSecret);
		const user = await ctx.db.get(userId);
		if (!user || user.isDeleted) throw new Error('User account is disabled.');
		const timestamp = now();
		return await ctx.db.insert('sessions', {
			userId,
			tokenHash,
			expiresAt,
			createdAt: timestamp,
			updatedAt: timestamp
		});
	}
});

export const getCurrentBySessionToken = query({
	args: { tokenHash: v.string() },
	handler: async (ctx, { tokenHash }) => {
		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token_hash', (q) => q.eq('tokenHash', tokenHash))
			.unique();
		if (!session || session.revokedAt || session.expiresAt <= now()) return null;
		return publicUser(await ctx.db.get(session.userId));
	}
});

export const revokeSession = mutation({
	args: { tokenHash: v.string() },
	handler: async (ctx, { tokenHash }) => {
		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token_hash', (q) => q.eq('tokenHash', tokenHash))
			.unique();
		if (!session || session.revokedAt) return false;
		await ctx.db.patch(session._id, { revokedAt: now(), updatedAt: now() });
		return true;
	}
});

export const setRole = mutation({
	args: { userId: v.id('users'), role: userRole, auth: authArg },
	handler: async (ctx, { userId, role, auth }) => {
		requireAdminAuth(auth);
		await ctx.db.patch(userId, { role, updatedAt: now() });
		return userId;
	}
});

export const listAdmin = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 100, auth }) => {
		requireAdminAuth(auth);
		const users = await ctx.db.query('users').order('desc').take(Math.min(limit, 200));
		return users.map(publicUser).filter(Boolean);
	}
});
