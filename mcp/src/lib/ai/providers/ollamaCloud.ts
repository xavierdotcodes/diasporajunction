import type {
	AiProvider,
	GenerateObjectInput,
	GenerateObjectResult,
	GenerateTextInput,
	GenerateTextResult
} from './types';

type OllamaConfig = {
	apiKey?: string;
	baseUrl?: string;
	model?: string;
	fetchImpl?: typeof fetch;
};

export function createOllamaCloudProvider(config: OllamaConfig = {}): AiProvider {
	const apiKey = config.apiKey ?? process.env.OLLAMA_API_KEY ?? process.env.OLLAMA_CLOUD_API_KEY;
	const baseUrl = (config.baseUrl ?? process.env.OLLAMA_BASE_URL ?? '').replace(/\/$/, '');
	const model = config.model ?? process.env.OLLAMA_MODEL ?? '';
	const fetchImpl = config.fetchImpl ?? fetch;

	function getMissingConfig(): string[] {
		return [
			apiKey ? undefined : 'OLLAMA_API_KEY',
			baseUrl ? undefined : 'OLLAMA_BASE_URL',
			model ? undefined : 'OLLAMA_MODEL'
		].filter(Boolean) as string[];
	}

	function isConfigured(): boolean {
		return getMissingConfig().length === 0;
	}

	async function generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
		const missingConfig = getMissingConfig();
		if (missingConfig.length) {
			throw new Error(`${missingConfig.join(', ')} required for Ollama Cloud calls.`);
		}

		const prompt = [input.system, input.prompt].filter(Boolean).join('\n\n');
		const response = await fetchImpl(`${baseUrl}/generate`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model,
				prompt,
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
			text: String(raw.response ?? raw.message?.content ?? ''),
			model,
			provider: 'ollama-cloud',
			raw
		};
	}

	async function generateJson<T = unknown>(
		input: GenerateObjectInput
	): Promise<GenerateObjectResult<T>> {
		const result = await generateText({
			...input,
			system: [
				input.system,
				'Return only valid JSON. Do not include markdown fences.',
				input.schemaHint ? `Schema hint: ${input.schemaHint}` : undefined
			]
				.filter(Boolean)
				.join('\n')
		});

		try {
			return {
				ok: true,
				object: JSON.parse(result.text) as T,
				model: result.model,
				provider: result.provider,
				raw: result.raw
			};
		} catch (error) {
			throw new Error(`Ollama Cloud returned non-JSON output: ${(error as Error).message}`);
		}
	}

	return {
		generateText,
		generateObject: generateJson,
		generateJson,
		isConfigured,
		getMissingConfig,
		classify: generateJson
	};
}
