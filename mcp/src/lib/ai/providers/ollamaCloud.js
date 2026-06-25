import { missingProviderConfig } from './types.js';

export function createOllamaCloudProvider(config = {}) {
	const apiKey = config.apiKey ?? process.env.OLLAMA_API_KEY ?? process.env.OLLAMA_CLOUD_API_KEY ?? '';
	const baseUrl = String(config.baseUrl ?? process.env.OLLAMA_BASE_URL ?? '').replace(/\/$/, '');
	const model = config.model ?? process.env.OLLAMA_MODEL ?? '';
	const fetchImpl = config.fetchImpl ?? fetch;
	const provider = 'ollama-cloud';

	function getMissingConfig() {
		return [
			apiKey ? undefined : 'OLLAMA_API_KEY',
			baseUrl ? undefined : 'OLLAMA_BASE_URL',
			model ? undefined : 'OLLAMA_MODEL'
		].filter(Boolean);
	}

	function isConfigured() {
		return getMissingConfig().length === 0;
	}

	async function generateText(input = {}) {
		const missingConfig = getMissingConfig();
		if (missingConfig.length) return missingProviderConfig(provider, missingConfig);

		const response = await fetchImpl(`${baseUrl}/generate`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model,
				prompt: [input.system, input.prompt].filter(Boolean).join('\n\n'),
				stream: false,
				options: {
					temperature: input.temperature ?? 0.2,
					num_predict: input.maxTokens
				}
			})
		});

		if (!response.ok) {
			throw new Error(`Ollama Cloud request failed with ${response.status}.`);
		}

		const raw = await response.json();
		return {
			ok: true,
			text: String(raw.response ?? raw.message?.content ?? ''),
			model,
			provider,
			raw
		};
	}

	async function generateJson(input = {}) {
		const result = await generateText({
			...input,
			system: [
				input.system,
				'Return only valid JSON. Do not include markdown fences or commentary.',
				input.schemaHint ? `Schema hint: ${input.schemaHint}` : undefined
			]
				.filter(Boolean)
				.join('\n')
		});
		if (!result.ok) return result;
		return {
			ok: true,
			object: safeParseJson(result.text),
			text: result.text,
			model: result.model,
			provider: result.provider,
			raw: result.raw
		};
	}

	return { generateText, generateJson, generateObject: generateJson, isConfigured, getMissingConfig };
}

export function safeParseJson(text) {
	try {
		return JSON.parse(String(text ?? '').trim());
	} catch {
		const match = String(text ?? '').match(/\{[\s\S]*\}|\[[\s\S]*\]/);
		if (!match) return {};
		try {
			return JSON.parse(match[0]);
		} catch {
			return {};
		}
	}
}
