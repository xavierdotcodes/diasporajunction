import { describe, expect, it } from 'vitest';
import {
	createAiService,
	generateListingSummary,
	rewriteDirectorySearch,
	summarizeApplicationForReview
} from '../src/lib/ai/service.js';

describe('ai service', () => {
	it('returns a directory search rewrite output shape with deterministic fallback', async () => {
		const result = await rewriteDirectorySearch({
			query: 'urgent housing near East Legon',
			location: 'East Legon',
			targetAudience: 'DIASPORA'
		});
		expect(result).toMatchObject({
			intent: 'HOUSING',
			category: 'REAL_ESTATE',
			location: 'East Legon',
			targetAudience: 'DIASPORA',
			urgency: 'HIGH',
			remoteOrInPerson: 'IN_PERSON'
		});
		expect(result.serviceKeywords).toContain('housing');
	});

	it('does not include private document URLs in application summaries', async () => {
		const result = await summarizeApplicationForReview({
			businessName: 'Test Provider',
			category: 'LEGAL_IMMIGRATION',
			documentUrl: 'https://private.example/doc',
			verificationDocuments: [{ storageId: 'secret-storage' }]
		});
		expect(JSON.stringify(result)).not.toContain('private.example');
		expect(JSON.stringify(result)).not.toContain('secret-storage');
		expect(result.suggestion).toBe(true);
	});

	it('does not invent unsupported services for listing summaries', async () => {
		const result = await generateListingSummary(
			{ servicesOffered: ['Airport pickup'], keywords: ['transport'], description: 'Airport rides only.' },
			async () => ({
				ok: true,
				data: {
					servicesSummary: 'Airport pickup, visa filing',
					keywords: ['transport', 'visa filing']
				}
			})
		);
		expect(result.servicesSummary).toBe('Airport pickup');
		expect(result.keywords).toEqual(['transport']);
	});

	it('uses missing-config fallback without network calls', async () => {
		const service = createAiService({
			provider: {
				isConfigured: () => false,
				getMissingConfig: () => ['OLLAMA_API_KEY'],
				generateJson: async () => {
					throw new Error('should not be called');
				}
			}
		});
		const result = await service.rewriteDirectorySearch({ query: 'driver in Accra' });
		expect(result).toMatchObject({ intent: 'TRANSPORT', fallbackUsed: true });
	});
});
