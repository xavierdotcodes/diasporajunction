<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/components/shared/Logo.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {string} [src]
	 * @property {string} [width] - default width
	 * @property {string} [alt]
	 */

	/** @type {Props} */
	let { src = '/images/logos/logo-optimized.png', width = '100', alt = 'Diaspora Junxion Logo' } = $props();
</script>

<div class="logo">
	<a href="/">
		<img {src} {alt} {width} />
	</a>
</div>

<style>
	.logo img {
		display: block;
		height: auto;
		max-width: 100%;
	}
</style>
