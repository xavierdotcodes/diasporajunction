import { createOllamaCloudProvider } from './providers/ollamaCloud.js';

export function createAiProvider(config = {}) {
	return config.provider ?? createOllamaCloudProvider(config.ollama ?? config);
}
