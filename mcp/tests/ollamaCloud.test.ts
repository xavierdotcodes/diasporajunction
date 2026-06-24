import { describe, expect, it } from 'vitest';
import { createOllamaCloudProvider } from '../src/lib/ai/providers/ollamaCloud';

describe('ollama cloud provider', () => {
	it('routes generateText through the configured endpoint', async () => {
		const calls: RequestInit[] = [];
		const provider = createOllamaCloudProvider({
			apiKey: 'test-key',
			baseUrl: 'https://example.test/api',
			model: 'test-model',
			fetchImpl: async (_url, init) => {
				calls.push(init ?? {});
				return new Response(JSON.stringify({ response: 'hello' }), { status: 200 });
			}
		});

		const result = await provider.generateText({ prompt: 'Say hi' });
		expect(result).toMatchObject({ text: 'hello', model: 'test-model', provider: 'ollama-cloud' });
		expect(calls[0].headers).toMatchObject({ Authorization: 'Bearer test-key' });
	});

	it('parses object responses', async () => {
		const provider = createOllamaCloudProvider({
			apiKey: 'test-key',
			fetchImpl: async () => new Response(JSON.stringify({ response: '{"category":"TECH_DIGITAL"}' }))
		});
		await expect(provider.generateObject({ prompt: 'classify' })).resolves.toMatchObject({
			object: { category: 'TECH_DIGITAL' }
		});
	});
});
