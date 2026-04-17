<script>
	import { createEventDispatcher } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/components/ui/Sheet.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {boolean} [open]
	 * @property {string} [title]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { open = false, title = '', children } = $props();

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}
</script>

{#if open}
	<div class="fixed inset-0 z-[90] lg:hidden" aria-hidden={!open}>
		<button
			type="button"
			class="absolute inset-0 bg-black/50 backdrop-blur-sm"
			aria-label="Close navigation menu"
			onclick={close}
			in:fade={{ duration: 160 }}
			out:fade={{ duration: 160 }}
		></button>

		<div
			class="absolute inset-y-0 right-0 flex h-full w-[min(24rem,100vw)] flex-col border-l border-black/10 bg-[#f2b705] shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-label={title || 'Sheet'}
			in:fly={{ x: 24, duration: 200 }}
			out:fly={{ x: 24, duration: 180 }}
		>
			<div class="flex items-center justify-between border-b border-black/10 px-5 py-4">
				<h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-900">{title}</h2>
				<button
					type="button"
					class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-neutral-800"
					aria-label="Close navigation menu"
					onclick={close}
				>
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<div class="min-h-0 flex-1 overflow-y-auto px-5 py-6">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
