// src/routes/logout/+server.js
import { redirect } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	// remove the session cookie
	cookies.delete('session', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true
	});

	// redirect to login page
	throw redirect(302, '/login');
};
