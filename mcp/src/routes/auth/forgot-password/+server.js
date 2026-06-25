// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST() {
	return json(
		{
			ok: false,
			error: 'Password reset is not implemented yet. Contact an administrator to reset access.'
		},
		{ status: 501 }
	);
}
