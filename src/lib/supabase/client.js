import { env } from '$env/dynamic/public';
import { createBrowserClient } from '@supabase/ssr';

let browserClient;

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

export function getSupabaseBrowserClient() {
	const { url, key } = getSupabaseConfig();

	if (!hasSupabaseConfig()) {
		return null;
	}

	if (!browserClient) {
		browserClient = createBrowserClient(url, key);
	}

	return browserClient;
}
