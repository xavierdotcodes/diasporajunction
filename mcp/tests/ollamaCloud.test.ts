import { describe, expect, it } from 'vitest';
import { createOllamaCloudProvider } from '../src/lib/ai/providers/ollamaCloud';
import { createOllamaCloudProvider as createJsOllamaCloudProvider, safeParseJson } from '../src/lib/ai/providers/ollamaCloud.js';

describe('ollama cloud provider', () => {
	it('routes generateText through the configured endpoint', async () => {
		const calls: { url: string; init: RequestInit }[] = [];
		const provider = createOllamaCloudProvider({
			apiKey: 'test-key',
			baseUrl: 'https://example.test/api',
			model: 'test-model',
			fetchImpl: async (_url, init) => {
				calls.push({ url: String(_url), init: init ?? {} });
				return new Response(JSON.stringify({ response: 'hello' }), { status: 200 });
			}
		});

		const result = await provider.generateText({ prompt: 'Say hi', temperature: 0.4, maxTokens: 99 });
		expect(result).toMatchObject({ text: 'hello', model: 'test-model', provider: 'ollama-cloud' });
		expect(calls[0].url).toBe('https://example.test/api/generate');
		expect(calls[0].init.headers).toMatchObject({ Authorization: 'Bearer test-key' });
		expect(JSON.parse(String(calls[0].init.body))).toMatchObject({
			model: 'test-model',
			prompt: 'Say hi',
			stream: false,
			options: { temperature: 0.4, num_predict: 99 }
		});
	});

	it('parses object responses', async () => {
		const provider = createOllamaCloudProvider({
			apiKey: 'test-key',
			baseUrl: 'https://example.test/api',
			model: 'test-model',
			fetchImpl: async () => new Response(JSON.stringify({ response: '{"category":"TECH_DIGITAL"}' }))
		});
		await expect(provider.generateObject({ prompt: 'classify' })).resolves.toMatchObject({
			object: { category: 'TECH_DIGITAL' }
		});
	});

	it('returns structured missing config in the runtime JS adapter', async () => {
		const provider = createJsOllamaCloudProvider({ apiKey: '', baseUrl: '', model: '' });
		expect(provider.isConfigured()).toBe(false);
		await expect(provider.generateText({ prompt: 'hello' })).resolves.toMatchObject({
			ok: false,
			missingConfig: ['OLLAMA_API_KEY', 'OLLAMA_BASE_URL', 'OLLAMA_MODEL']
		});
	});

	it('safely parses JSON from fenced or noisy output', () => {
		expect(safeParseJson('```json\n{"intent":"HOUSING"}\n```')).toEqual({ intent: 'HOUSING' });
		expect(safeParseJson('not json')).toEqual({});
	});
});
