import { json } from '@sveltejs/kit';
import { captureLeadSignup } from '$lib/server/leads';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/api/leads/+server.js');

export async function POST({ request }) {
	try {
		const payload = await request.json();
		const result = await captureLeadSignup(payload);

		if (!result.ok) {
			return json({ error: result.error }, { status: result.status || 400 });
		}

		return json({
			success: true,
			leadId: result.lead.id,
			created: result.created
		});
	} catch (error) {
		console.error('Lead capture failed:', error);
		return json(
			{
				error: 'Something went wrong while saving your email. Please try again.'
			},
			{ status: 500 }
		);
	}
}
