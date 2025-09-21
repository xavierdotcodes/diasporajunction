// tailwind.config.js
import skeleton from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/@skeletonlabs/skeleton/**/*.svelte'],
	theme: {
		extend: {
			// Your custom theme extensions here
		}
	},
	plugins: [skeleton()]
};
