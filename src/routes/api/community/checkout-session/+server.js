import { json } from '@sveltejs/kit';

export async function POST() {
	return json(
		{
			error:
				'Community checkout is no longer active. The current community flow books consults through Calendly.'
		},
		{ status: 410 }
	);
}
