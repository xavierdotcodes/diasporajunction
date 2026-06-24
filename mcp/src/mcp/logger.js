export function createLogger(scope = 'mcp') {
	return {
		info(event, message = 'info') {
			console.error(JSON.stringify({ level: 'info', scope, message, ...sanitize(event) }));
		},
		error(event, message = 'error') {
			console.error(JSON.stringify({ level: 'error', scope, message, ...sanitize(event) }));
		}
	};
}

export async function withToolLogging(toolName, logger, fn) {
	const started = Date.now();
	try {
		const result = await fn();
		logger.info(
			{ toolName, ok: Boolean(result?.ok), durationMs: Date.now() - started },
			'MCP tool completed'
		);
		return result;
	} catch (error) {
		logger.error(
			{ toolName, ok: false, durationMs: Date.now() - started, error: safeError(error) },
			'MCP tool failed'
		);
		return {
			ok: false,
			error: safeError(error),
			message: safeError(error),
			missingConfig: [],
			notImplemented: false
		};
	}
}

function safeError(error) {
	return error instanceof Error ? error.message : 'Unknown error';
}

function sanitize(value) {
	return JSON.parse(
		JSON.stringify(value, (key, val) => {
			if (/secret|token|key|authorization/i.test(key)) return '[redacted]';
			return val;
		})
	);
}
