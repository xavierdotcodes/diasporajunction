import pino from 'pino';

const isBrowser = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV !== 'production';

function createConsoleLogger(bindings = {}) {
	const formatArgs = (args) => {
		if (args.length === 0) return [bindings];

		const [first, ...rest] = args;
		if (first && typeof first === 'object' && !Array.isArray(first)) {
			return [{ ...bindings, ...first }, ...rest];
		}

		return [bindings, first, ...rest];
	};

	const emit = (level, ...args) => {
		const method = console[level] ? level : 'log';
		const scopePrefix = bindings.scope ? `[DiasporaJunxion][${bindings.scope}]` : '[DiasporaJunxion]';
		console[method](scopePrefix, ...formatArgs(args));
	};

	return {
		child(nextBindings = {}) {
			return createConsoleLogger({ ...bindings, ...nextBindings });
		},
		debug(...args) {
			emit('debug', ...args);
		},
		info(...args) {
			emit('info', ...args);
		},
		warn(...args) {
			emit('warn', ...args);
		},
		error(...args) {
			emit('error', ...args);
		}
	};
}

function createServerLogger() {
	try {
		if (isDev) {
			return pino({
				name: 'DiasporaJunxion',
				level: 'debug',
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
						translateTime: 'SYS:standard',
						ignore: 'pid,hostname'
					}
				}
			});
		}

		return pino({
			name: 'DiasporaJunxion',
			level: 'info'
		});
	} catch (error) {
		console.warn('[logger] Falling back to standard pino logger:', error);

		return pino({
			name: 'DiasporaJunxion',
			level: isDev ? 'debug' : 'info'
		});
	}
}

export const logger = isBrowser ? createConsoleLogger() : createServerLogger();

export function scopedLogger(scope) {
	return logger.child({ scope });
}

export function fileLogger(file, bindings = {}) {
	const log = scopedLogger(file);
	log.debug({ phase: 'module_loaded', ...bindings });
	return log;
}
