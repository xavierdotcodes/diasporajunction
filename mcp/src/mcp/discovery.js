const INTENT_FILTERS = {
	RELOCATION: { category: 'BUSINESS_SERVICES', targetAudience: 'DIASPORA', keywords: ['relocation', 'settle', 'diaspora'] },
	HOUSING: { category: 'REAL_ESTATE', targetAudience: 'DIASPORA', keywords: ['housing', 'rent', 'property'] },
	TRANSPORT: { category: 'TRANSPORT', keywords: ['driver', 'transport', 'airport'] },
	EVENT_VENDOR: { category: 'EVENTS_ENTERTAINMENT', keywords: ['event', 'vendor', 'catering'] },
	LEGAL_IMMIGRATION: { category: 'LEGAL_IMMIGRATION', targetAudience: 'DIASPORA', keywords: ['legal', 'immigration', 'visa'] },
	BUSINESS_SETUP: { category: 'BUSINESS_SERVICES', keywords: ['business', 'setup', 'registration'] },
	HEALTH_WELLNESS: { category: 'HEALTH_WELLNESS', keywords: ['health', 'wellness', 'clinic'] },
	HOME_SERVICES: { category: 'HOME_SERVICES', keywords: ['home', 'repair', 'cleaning'] },
	CREATIVE_MEDIA: { category: 'CREATIVE_MEDIA', keywords: ['creative', 'photo', 'video'] },
	LOCAL_ERRANDS: { category: 'HOME_SERVICES', keywords: ['errands', 'local help', 'reliable'] },
	TOURISM: { category: 'TOURISM_TRAVEL', keywords: ['tour', 'travel', 'visitor'] },
	EMERGENCY_HELP: { targetAudience: 'BOTH', keywords: ['urgent', 'emergency', 'help'] },
	GENERAL_SERVICE_SEARCH: { targetAudience: 'BOTH', keywords: [] }
};

export function buildDiscoveryFilters(input = {}, intent = 'GENERAL_SERVICE_SEARCH') {
	const inferred = inferIntent(input.query ?? input.need ?? '', intent);
	const defaults = INTENT_FILTERS[inferred] ?? INTENT_FILTERS.GENERAL_SERVICE_SEARCH;
	return compact({
		...defaults,
		intent: inferred,
		query: input.query ?? input.need,
		location: input.location ?? input.city,
		category: input.category ?? defaults.category,
		targetAudience: input.targetAudience ?? defaults.targetAudience,
		verifiedOnly: input.verifiedOnly ?? input.requireVerified ?? false,
		remoteAvailable: input.remoteAvailable,
		inPersonAvailable: input.inPersonAvailable,
		keywords: unique([...(defaults.keywords ?? []), ...(input.keywords ?? [])]),
		limit: input.limit ?? 8
	});
}

export function inferIntent(text, fallback = 'GENERAL_SERVICE_SEARCH') {
	const value = String(text ?? '').toLowerCase();
	if (/relocat|settle|moving|move to ghana/.test(value)) return 'RELOCATION';
	if (/housing|house|apartment|rent|east legon|property/.test(value)) return 'HOUSING';
	if (/driver|transport|car|airport|ride/.test(value)) return 'TRANSPORT';
	if (/event|wedding|vendor|cater|dj|decor/.test(value)) return 'EVENT_VENDOR';
	if (/legal|immigration|visa|passport|resident/.test(value)) return 'LEGAL_IMMIGRATION';
	if (/errand|runner|local help|reliable/.test(value)) return 'LOCAL_ERRANDS';
	if (/health|doctor|clinic|wellness/.test(value)) return 'HEALTH_WELLNESS';
	if (/tour|travel|visitor|tourism/.test(value)) return 'TOURISM';
	return fallback;
}

export function publicDiscoveryDescription(focus) {
	return `Use this public DiasporaJunxion discovery tool when a user is looking for trusted, verified, or diaspora-friendly services in Ghana${focus ? `, especially ${focus}` : ''}. It returns only active public listings and public contact options.`;
}

function compact(value) {
	return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));
}

function unique(values) {
	return [...new Set(values.filter(Boolean))];
}
