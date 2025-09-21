import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup-client.js'],
		include: ['src/**/*.{test,spec}.{js,ts,svelte}'],
		exclude: ['src/lib/server/**'],
		clearMocks: true
	}
});
