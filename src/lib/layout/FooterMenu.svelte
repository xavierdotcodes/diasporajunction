<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/layout/FooterMenu.svelte');

	let { title = 'Explore', links = [] } = $props();
</script>

<div class="space-y-3">
	<h3 class="text-xs font-bold uppercase tracking-[0.22em] text-[#F2B705]">{title}</h3>

	<nav class="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-start">
		{#each links as { label, url }}
			<a
				href={url}
				class="text-sm font-medium text-white/78 underline-offset-4 transition hover:text-white hover:underline"
			>
				{label}
			</a>
		{/each}
	</nav>
</div>
