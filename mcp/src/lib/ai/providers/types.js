export const AI_PROVIDER_MISSING_CONFIG = 'AI_PROVIDER_MISSING_CONFIG';

export function missingProviderConfig(provider, missingConfig) {
	return {
		ok: false,
		provider,
		missingConfig,
		error: AI_PROVIDER_MISSING_CONFIG,
		message: `${provider} is missing required configuration.`
	};
}
