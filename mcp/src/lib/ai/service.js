import { createAiProvider } from './provider.js';

export const DIRECTORY_INTENTS = [
	'RELOCATION',
	'HOUSING',
	'TRANSPORT',
	'EVENT_VENDOR',
	'LEGAL_IMMIGRATION',
	'BUSINESS_SETUP',
	'HEALTH_WELLNESS',
	'HOME_SERVICES',
	'CREATIVE_MEDIA',
	'LOCAL_ERRANDS',
	'TOURISM',
	'EMERGENCY_HELP',
	'GENERAL_SERVICE_SEARCH'
];

const INTENT_CATEGORY = {
	HOUSING: 'REAL_ESTATE',
	TRANSPORT: 'TRANSPORT',
	EVENT_VENDOR: 'EVENTS_ENTERTAINMENT',
	LEGAL_IMMIGRATION: 'LEGAL_IMMIGRATION',
	HEALTH_WELLNESS: 'HEALTH_WELLNESS',
	HOME_SERVICES: 'HOME_SERVICES',
	CREATIVE_MEDIA: 'CREATIVE_MEDIA',
	TOURISM: 'TOURISM_TRAVEL',
	BUSINESS_SETUP: 'BUSINESS_SERVICES'
};

export function createAiService(options = {}) {
	const provider = options.provider ?? createAiProvider(options);

	async function generateJsonWithFallback({ system, prompt, schemaHint, fallback, temperature = 0.2, maxTokens = 800 }) {
		if (!provider.isConfigured()) {
			return { ok: false, missingConfig: provider.getMissingConfig(), data: fallback, fallbackUsed: true };
		}
		try {
			const result = await provider.generateJson({ system, prompt, schemaHint, temperature, maxTokens });
			if (!result.ok) return { ...result, data: fallback, fallbackUsed: true };
			return { ok: true, data: result.object ?? fallback, provider: result.provider, model: result.model };
		} catch (error) {
			return { ok: false, error: safeError(error), data: fallback, fallbackUsed: true, missingConfig: [] };
		}
	}

	return {
		isConfigured: () => provider.isConfigured(),
		getMissingConfig: () => provider.getMissingConfig(),
		rewriteDirectorySearch: (input) => rewriteDirectorySearch(input, generateJsonWithFallback),
		summarizeApplicationForReview: (input) => summarizeApplicationForReview(input, generateJsonWithFallback),
		generateListingSummary: (input) => generateListingSummary(input, generateJsonWithFallback),
		generateAdminTriageSummary: (input) => generateAdminTriageSummary(input, generateJsonWithFallback),
		generateListingImprovementSuggestions: (input) =>
			generateListingImprovementSuggestions(input, generateJsonWithFallback),
		generateLeadDigest: (input) => generateLeadDigest(input, generateJsonWithFallback)
	};
}

export async function rewriteDirectorySearch(input = {}, generate = null) {
	const fallback = deterministicDirectoryRewrite(input);
	if (!generate) return fallback;
	const result = await generate({
		system: 'You turn diaspora service search requests into safe public directory filters.',
		prompt: JSON.stringify({ query: input.query, location: input.location, targetAudience: input.targetAudience }),
		schemaHint: 'intent, category, location, targetAudience, serviceKeywords array, urgency, remoteOrInPerson, explanation',
		fallback
	});
	return normalizeDirectoryRewrite(result.data, fallback, result);
}

export async function summarizeApplicationForReview(input = {}, generate = null) {
	const safeInput = stripPrivateFields(input);
	const fallback = {
		summary: summarizeText([
			safeInput.businessName,
			safeInput.category,
			safeInput.city,
			safeInput.description
		]),
		suggestedCategory: safeInput.category,
		missingFields: missingFields(safeInput, ['businessName', 'contactName', 'email', 'phone', 'description', 'city']),
		riskFlags: safeInput.paymentStatus === 'PAID' ? [] : ['Payment is not marked paid.'],
		suggestedQuestions: [],
		recommendationText: 'Review the submitted details, payment status, and document status summary before deciding.',
		suggestion: true
	};
	if (!generate) return fallback;
	const result = await generate({
		system: 'Summarize a directory application for human admin review. Do not approve, reject, or include private document URLs.',
		prompt: JSON.stringify(safeInput),
		schemaHint: 'summary, suggestedCategory, missingFields array, riskFlags array, suggestedQuestions array, recommendationText',
		fallback
	});
	return { ...fallback, ...stripPrivateFields(result.data), suggestion: true };
}

export async function generateListingSummary(input = {}, generate = null) {
	const safeInput = stripPrivateFields(input);
	const services = arrayOfStrings(safeInput.servicesOffered);
	const fallback = {
		shortDescription: String(safeInput.shortDescription || safeInput.description || '').slice(0, 180),
		seoDescription: summarizeText([safeInput.businessName, safeInput.category, safeInput.city, safeInput.description]).slice(0, 260),
		servicesSummary: services.join(', '),
		keywords: arrayOfStrings(safeInput.keywords).concat(services).slice(0, 12),
		trustFocusedPublicSummary: summarizeText([safeInput.businessName, safeInput.verificationStatus, safeInput.serviceArea]),
		suggestion: true
	};
	if (!generate) return fallback;
	const result = await generate({
		system: 'Write public listing copy using only source facts. Do not invent services.',
		prompt: JSON.stringify(safeInput),
		schemaHint: 'shortDescription, seoDescription, servicesSummary, keywords array, trustFocusedPublicSummary',
		fallback
	});
	const output = { ...fallback, ...stripPrivateFields(result.data), suggestion: true };
	output.keywords = arrayOfStrings(output.keywords).filter((item) => sourceContains(safeInput, item)).slice(0, 12);
	output.servicesSummary = services.filter((item) => output.servicesSummary.includes(item)).join(', ') || fallback.servicesSummary;
	return output;
}

export async function generateAdminTriageSummary(input = {}, generate = null) {
	const fallback = {
		needsAttentionToday: summarizeText([input.needsAttentionSummary, input.recentActivitySummary]),
		highestPriorityItems: [],
		suggestedAdminNextActions: ['Review paid applications awaiting review.', 'Check failed or abandoned payments.'],
		risksBlockers: [],
		suggestion: true
	};
	if (!generate) return fallback;
	const result = await generate({
		system: 'Summarize admin triage. Suggestions only; do not override admin decisions.',
		prompt: JSON.stringify(stripPrivateFields(input)),
		schemaHint: 'needsAttentionToday, highestPriorityItems array, suggestedAdminNextActions array, risksBlockers array',
		fallback
	});
	return { ...fallback, ...stripPrivateFields(result.data), suggestion: true };
}

export async function generateListingImprovementSuggestions(input = {}, generate = null) {
	const fallback = {
		profileImprovementSuggestions: ['Keep service details specific and current.'],
		missingTrustSignals: input.verificationStatus === 'VERIFIED' ? [] : ['Public verification/trust signal is missing.'],
		contentPhotoRecommendations: input.mediaPresence?.hasCover ? [] : ['Add a clear cover image.'],
		ctaRecommendations: ['Make the preferred contact action easy to find.'],
		suggestion: true
	};
	if (!generate) return fallback;
	const result = await generate({
		system: 'Suggest profile improvements for a public directory listing. Suggestions only.',
		prompt: JSON.stringify(stripPrivateFields(input)),
		schemaHint: 'profileImprovementSuggestions array, missingTrustSignals array, contentPhotoRecommendations array, ctaRecommendations array',
		fallback
	});
	return { ...fallback, ...stripPrivateFields(result.data), suggestion: true };
}

export async function generateLeadDigest(input = {}, generate = null) {
	const fallback = {
		digestSummary: `Lead activity summary for ${input.period ?? 'the selected period'}.`,
		topLeadSourcesActions: [],
		suggestedImprovements: [],
		providerFacingSummary: 'Review recent listing views and contact actions to improve follow-up.',
		suggestion: true
	};
	if (!generate) return fallback;
	const result = await generate({
		system: 'Generate a provider-facing lead digest. Suggestions only.',
		prompt: JSON.stringify(stripPrivateFields(input)),
		schemaHint: 'digestSummary, topLeadSourcesActions array, suggestedImprovements array, providerFacingSummary',
		fallback
	});
	return { ...fallback, ...stripPrivateFields(result.data), suggestion: true };
}

function deterministicDirectoryRewrite(input = {}) {
	const text = `${input.query ?? ''} ${input.location ?? ''}`.toLowerCase();
	const intent =
		[
			[/rent|house|home|apartment|real estate|accommodation|housing/, 'HOUSING'],
			[/driver|airport|car|ride|transport/, 'TRANSPORT'],
			[/event|wedding|cater|vendor|dj|decor/, 'EVENT_VENDOR'],
			[/visa|immigration|legal|lawyer|permit/, 'LEGAL_IMMIGRATION'],
			[/business|company|register|setup/, 'BUSINESS_SETUP'],
			[/clinic|health|wellness|doctor|therapy/, 'HEALTH_WELLNESS'],
			[/clean|repair|plumb|electric|home service/, 'HOME_SERVICES'],
			[/photo|video|media|creative|design/, 'CREATIVE_MEDIA'],
			[/errand|delivery|local help|assistant/, 'LOCAL_ERRANDS'],
			[/tour|travel|guide|tourism/, 'TOURISM'],
			[/urgent|emergency|now|asap/, 'EMERGENCY_HELP']
		].find(([pattern]) => pattern.test(text))?.[1] ?? 'GENERAL_SERVICE_SEARCH';
	return {
		intent: input.biasIntent ?? intent,
		category: INTENT_CATEGORY[input.biasIntent ?? intent],
		location: input.location,
		targetAudience: input.targetAudience,
		serviceKeywords: String(input.query ?? '').split(/\s+/).filter((word) => word.length > 2).slice(0, 8),
		urgency: /urgent|emergency|now|asap/.test(text) ? 'HIGH' : 'NORMAL',
		remoteOrInPerson: /remote|online|virtual/.test(text) ? 'REMOTE' : /near|local|in person/.test(text) ? 'IN_PERSON' : 'EITHER',
		explanation: 'Deterministic search interpretation.',
		fallbackUsed: true
	};
}

function normalizeDirectoryRewrite(data = {}, fallback, meta = {}) {
	const intent = DIRECTORY_INTENTS.includes(data.intent) ? data.intent : fallback.intent;
	return {
		...fallback,
		...data,
		intent,
		category: data.category || fallback.category || INTENT_CATEGORY[intent],
		serviceKeywords: arrayOfStrings(data.serviceKeywords ?? fallback.serviceKeywords),
		explanation: data.explanation || fallback.explanation,
		aiRewriteUsed: Boolean(meta.ok)
	};
}

function stripPrivateFields(value) {
	if (Array.isArray(value)) return value.map(stripPrivateFields);
	if (!value || typeof value !== 'object') return value;
	const blocked = /documentUrl|storageId|adminNotes|providerMetadata|verificationDocuments|private/i;
	return Object.fromEntries(
		Object.entries(value)
			.filter(([key]) => !blocked.test(key))
			.map(([key, item]) => [key, stripPrivateFields(item)])
	);
}

function missingFields(input, fields) {
	return fields.filter((field) => !String(input[field] ?? '').trim());
}

function summarizeText(parts) {
	return parts.filter(Boolean).join(' - ') || 'No source details were provided.';
}

function arrayOfStrings(value) {
	return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function sourceContains(source, value) {
	return JSON.stringify(source).toLowerCase().includes(String(value).toLowerCase());
}

function safeError(error) {
	return error instanceof Error ? error.message.slice(0, 240) : 'AI provider call failed.';
}
