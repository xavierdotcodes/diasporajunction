// @ts-nocheck
import { json, text } from '@sveltejs/kit';
import { resetPasswordWithToken } from '$lib/server/email/authEmails.js';
import { clearSessionCookieOptions, SESSION_COOKIE_NAME } from '$lib/server/sessionAuth.js';

function formPage(token) {
	return text(
		`<!doctype html><html><head><title>Reset password</title></head><body><h1>Reset password</h1><form method="post" action="/auth/reset-password"><input type="hidden" name="token" value="${String(token || '').replaceAll('"', '&quot;')}"><label>New password <input type="password" name="password" minlength="8" required></label><button type="submit">Reset password</button></form></body></html>`,
		{ headers: { 'content-type': 'text/html; charset=utf-8' } }
	);
}

function statusPage(title, body) {
	return text(`<!doctype html><html><head><title>${title}</title></head><body><h1>${title}</h1><p>${body}</p></body></html>`, {
		headers: { 'content-type': 'text/html; charset=utf-8' }
	});
}

export async function GET(event) {
	return formPage(event.url.searchParams.get('token'));
}

export async function POST(event) {
	const contentType = event.request.headers.get('content-type') || '';
	const input = contentType.includes('application/json')
		? await event.request.json().catch(() => ({}))
		: Object.fromEntries(await event.request.formData());
	const result = await resetPasswordWithToken(input.token, input.password);
	if (!result.ok) {
		const message = result.reason === 'weak_password' ? 'Password must be at least 8 characters.' : 'This reset link is invalid, expired, or already used.';
		if (contentType.includes('application/json')) return json({ ok: false, error: message }, { status: 400 });
		return statusPage('Password reset failed', message);
	}
	event.cookies.set(SESSION_COOKIE_NAME, '', clearSessionCookieOptions());
	if (contentType.includes('application/json')) return json({ ok: true });
	return statusPage('Password reset complete', 'Your password has been updated. Please sign in again.');
}
