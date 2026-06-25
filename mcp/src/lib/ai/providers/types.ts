export type GenerateTextInput = {
	system?: string;
	prompt: string;
	temperature?: number;
	maxTokens?: number;
};

export type GenerateObjectInput = GenerateTextInput & {
	schema?: unknown;
	schemaHint?: string;
};

export type GenerateTextResult = {
	text: string;
	model: string;
	provider: string;
	raw?: unknown;
};

export type GenerateObjectResult<T = unknown> = {
	ok?: boolean;
	object: T;
	model: string;
	provider: string;
	raw?: unknown;
};

export interface AiProvider {
	generateText(input: GenerateTextInput): Promise<GenerateTextResult>;
	generateObject<T = unknown>(input: GenerateObjectInput): Promise<GenerateObjectResult<T>>;
	generateJson<T = unknown>(input: GenerateObjectInput): Promise<GenerateObjectResult<T>>;
	isConfigured(): boolean;
	getMissingConfig(): string[];
	embedText?(input: { text: string }): Promise<{ embedding: number[]; model: string; provider: string }>;
	classify?<T = unknown>(input: GenerateObjectInput): Promise<GenerateObjectResult<T>>;
}
