export type GenerateTextInput = {
	system?: string;
	prompt: string;
	temperature?: number;
	maxTokens?: number;
};

export type GenerateObjectInput = GenerateTextInput & {
	schema?: unknown;
};

export type GenerateTextResult = {
	text: string;
	model: string;
	provider: string;
	raw?: unknown;
};

export type GenerateObjectResult<T = unknown> = {
	object: T;
	model: string;
	provider: string;
	raw?: unknown;
};

export interface AiProvider {
	generateText(input: GenerateTextInput): Promise<GenerateTextResult>;
	generateObject<T = unknown>(input: GenerateObjectInput): Promise<GenerateObjectResult<T>>;
	embedText?(input: { text: string }): Promise<{ embedding: number[]; model: string; provider: string }>;
	classify?<T = unknown>(input: GenerateObjectInput): Promise<GenerateObjectResult<T>>;
}
