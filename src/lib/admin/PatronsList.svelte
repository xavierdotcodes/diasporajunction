<script>
	import { createEventDispatcher } from 'svelte';
	import PatronItem from './PatronItem.svelte';

	export let patrons = [];
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
