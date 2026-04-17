<!-- StepContainer.svelte -->
<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/ui/StepContainer.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {any} index
	 * @property {boolean} [active]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { index, active = false, children } = $props();
</script>

<div
	class={`transition-all duration-300 ${active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none absolute inset-0'}`}
>
	{@render children?.()}
</div>
