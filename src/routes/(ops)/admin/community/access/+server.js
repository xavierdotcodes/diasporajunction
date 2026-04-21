import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { requestLogger, serializeError } from '$lib/utils/logger';

function normalizeEmail(email) {
	return email?.trim().toLowerCase();
}

function isAdmin(locals) {
	return Boolean(locals.user?.roles?.some((role) => (role.role ?? role) === 'ADMIN'));
}

export async function POST(event) {
	const log = requestLogger('src/routes/(ops)/admin/community/access/+server.js', event);

	try {
		if (!isAdmin(event.locals)) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { email, firstName, action } = await event.request.json();
		const normalizedEmail = normalizeEmail(email);

		if (!normalizedEmail || !['grant', 'revoke'].includes(action)) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		let grant;

		if (action === 'grant') {
			grant = await prisma.communityAccessGrant.upsert({
				where: { email: normalizedEmail },
				update: {
					firstName: firstName || undefined,
					status: 'ACTIVE',
					grantedAt: new Date(),
					revokedAt: null,
					grantedByEmail: event.locals.user?.email ?? null
				},
				create: {
					email: normalizedEmail,
					firstName: firstName || null,
					status: 'ACTIVE',
					grantedAt: new Date(),
					grantedByEmail: event.locals.user?.email ?? null,
					source: 'admin_grant'
				}
			});
		} else {
			const existingGrant = await prisma.communityAccessGrant.findUnique({
				where: { email: normalizedEmail }
			});

			if (!existingGrant) {
				return json({ error: 'No access record found for this email' }, { status: 404 });
			}

			grant = await prisma.communityAccessGrant.update({
				where: { email: normalizedEmail },
				data: {
					status: 'REVOKED',
					revokedAt: new Date()
				}
			});
		}

		log.info({
			phase: 'community_access_admin_updated',
			action,
			email: normalizedEmail,
			status: grant.status
		});

		return json({ success: true, grant });
	} catch (error) {
		log.error({
			phase: 'community_access_admin_failed',
			error: serializeError(error)
		});
		return json({ error: 'Failed to update community access' }, { status: 500 });
	}
}
