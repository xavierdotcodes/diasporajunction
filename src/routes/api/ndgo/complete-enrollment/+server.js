import { json } from '@sveltejs/kit';

export async function POST() {
	return json({ error: 'The NDGO paid enrollment completion API is no longer active.' }, { status: 410 });
}
