<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/layout/Logo.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {string} [src]
	 */

	/** @type {Props} */
	let { src = '/images/logos/logo-optimized.png' } = $props();
</script>

<div>
	<a href="/"> <img {src} alt="Diaspora Junxion Logo" width="100px" /></a>
</div>
