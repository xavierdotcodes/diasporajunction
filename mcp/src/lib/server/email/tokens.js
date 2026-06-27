// @ts-nocheck
import crypto from 'node:crypto';

export const AUTH_TOKEN_TYPES = {
	EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
	PASSWORD_RESET: 'PASSWORD_RESET'
};

export function createRawAuthToken() {
	return crypto.randomBytes(32).toString('base64url');
}

export function hashAuthToken(token) {
	return crypto.createHash('sha256').update(String(token)).digest('base64url');
}

export function tokenExpiry(msFromNow) {
	return Date.now() + msFromNow;
}
