import { json } from '@sveltejs/kit';

export async function POST() {
	return json({ error: 'The tours booking completion API is no longer active.' }, { status: 410 });
}
