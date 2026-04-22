import { getHousingViewer } from '$lib/server/housing/access';
import { requestLogger } from '$lib/utils/logger';

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
	const { locals } = event;
	const log = requestLogger('root.layout.server', event);

	log.info({
		op: 'load',
		phase: 'start',
		authenticated: Boolean(locals.user)
	});

	const user = locals.user
		? {
				id: locals.user.id,
				email: locals.user.email ?? null,
				name: locals.user.name ?? null,
				subscribed: Boolean(locals.user.subscribed),
				roles: Array.isArray(locals.user.roles)
					? locals.user.roles.map((role) => role.role ?? role)
					: []
			}
		: null;

	log.info({
		op: 'load',
		phase: 'success',
		authenticated: Boolean(user),
		roleCount: user?.roles?.length ?? 0
	});

	const housingViewer = await getHousingViewer(locals, { op: 'root_layout' });

	return { user, housingViewer };
}
