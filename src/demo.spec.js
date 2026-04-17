import { describe, it, expect } from 'vitest';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/demo.spec.js');

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});
