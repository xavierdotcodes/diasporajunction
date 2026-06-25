import { json } from '@sveltejs/kit';

export async function POST() {
	return json(
		{ error: 'The tours PaymentIntent checkout flow is no longer active. Current tours use Calendly.' },
		{ status: 410 }
	);
}
