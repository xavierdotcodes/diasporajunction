import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr';

function getSupabaseConfig() {
	return {
		url: env.PUBLIC_SUPABASE_URL,
		key: env.PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.PUBLIC_SUPABASE_ANON_KEY
	};
}

export function hasSupabaseConfig() {
	const { url, key } = getSupabaseConfig();
	return Boolean(url && key);
}

export function createSupabaseServerClient(event) {
	const { url, key } = getSupabaseConfig();

	if (!hasSupabaseConfig()) {
		return null;
	}

	return createServerClient(url, key, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, {
						...options,
						path: '/'
					});
				}
			}
		}
	});
}
