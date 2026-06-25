import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sentrySvelteKit } from '@sentry/sveltekit';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [
        sentrySvelteKit({
            org: 'xaviercodes',
            project: 'diasporajunxion',
            autoUploadSourceMaps: Boolean(process.env.SENTRY_AUTH_TOKEN)
        }),
        tailwindcss(),
        sveltekit()
    ],
    server: {
        allowedHosts: [
            'localhost',
            '127.0.0.1',
            'hypereutectoid-autecologically-jason.ngrok-free.dev'
        ]
    }, // <--- COMMA HERE

    test: {
        expect: { requireAssertions: true },

        projects: [
            {
                extends: './vite.config.js',

                test: {
                    name: 'client',

                    browser: {
                        enabled: true,
                        provider: playwright(),
                        instances: [{ browser: 'chromium', headless: true }]
                    },

                    include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
                    exclude: ['src/lib/server/**']
                }
            },

            {
                extends: './vite.config.js',

                test: {
                    name: 'server',
                    environment: 'node',
                    include: ['src/**/*.{test,spec}.{js,ts}'],
                    exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
                }
            }
        ]
    }
});
