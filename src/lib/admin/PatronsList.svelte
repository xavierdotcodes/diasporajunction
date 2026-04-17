<script>
	import { createEventDispatcher } from 'svelte';
	import PatronItem from './PatronItem.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/PatronsList.svelte');

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
	{#each patrons as patron (patron.id)}
		<PatronItem {patron} on:hover={() => handleHover(patron)} on:leave={handleLeave} />
	{/each}
</div>
