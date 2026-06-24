export function ok(data = {}, message = 'OK', extra = {}) {
	return {
		ok: true,
		data,
		message,
		missingConfig: [],
		notImplemented: false,
		...extra
	};
}

export function fail(message, extra = {}) {
	return {
		ok: false,
		error: message,
		message,
		missingConfig: extra.missingConfig ?? [],
		notImplemented: Boolean(extra.notImplemented),
		data: extra.data
	};
}

export function notImplemented(message, data = {}) {
	return fail(message, { notImplemented: true, data });
}

export function missingConfig(message, missingConfig) {
	return fail(message, { missingConfig });
}

export function validateRequired(input, fields) {
	const missing = fields.filter((field) => !String(input?.[field] ?? '').trim());
	if (missing.length) {
		throw new Error(`Missing required fields: ${missing.join(', ')}.`);
	}
}
