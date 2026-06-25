import { json } from '@sveltejs/kit';

export async function POST() {
	return json({ error: 'The SPCE order completion flow is no longer active.' }, { status: 410 });
}
