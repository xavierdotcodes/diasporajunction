<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/space/Scarcity.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {string} [message]
	 */

	/** @type {Props} */
	let { message = '' } = $props();
</script>

<section class="scarcity">
	<p>{message}</p>
</section>

<style>
	.scarcity {
		background: #b06024;
		color: white;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		text-align: center;
		border-radius: 1rem;
	}
</style>
