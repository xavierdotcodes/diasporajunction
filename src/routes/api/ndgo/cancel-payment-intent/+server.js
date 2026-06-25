import { json } from '@sveltejs/kit';

export async function POST() {
	return json({ error: 'The NDGO PaymentIntent checkout flow is no longer active.' }, { status: 410 });
}
