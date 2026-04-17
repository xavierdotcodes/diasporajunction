<script>
	import { createEventDispatcher } from 'svelte';
	import PatronItem from './PatronItem.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/PatronItem.svelte');

	let { patrons = [] } = $props();
	const dispatch = createEventDispatcher();

	function handleHover(patron) {
		dispatch('hover', patron);
	}

	function handleLeave() {
		dispatch('leave');
	}
</script>

<div class="space-y-2">
	{#if patrons.length === 0}
		<p class="text-gray-500 italic text-center">No Touree reserved yet.</p>
	{:else}
		{#each patrons as patron (patron.id)}
			<PatronItem {patron} on:hover={() => handleHover(patron)} on:leave={handleLeave} />
		{/each}
	{/if}
</div>
