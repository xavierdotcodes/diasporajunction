// @ts-nocheck
import { text } from '@sveltejs/kit';
import { confirmEmailVerificationToken } from '$lib/server/email/authEmails.js';

function page(title, body) {
	return text(`<!doctype html><html><head><title>${title}</title></head><body><h1>${title}</h1><p>${body}</p></body></html>`, {
		headers: { 'content-type': 'text/html; charset=utf-8' }
	});
}

export async function GET(event) {
	const token = event.url.searchParams.get('token');
	const result = await confirmEmailVerificationToken(token);
	if (result.ok) return page('Email verified', 'Your email address has been verified.');
	const message = result.reason === 'expired' ? 'This verification link has expired.' : 'This verification link is invalid or has already been used.';
	return page('Email verification failed', message);
}
