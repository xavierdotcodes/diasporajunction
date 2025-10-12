<script>
	import ItineraryStep from '$lib/tours/ItineraryStep.svelte';
	export let steps = [];
</script>

<div class="space-y-28">
	{#each steps as step, i}
		<ItineraryStep {step} index={i} />
	{/each}
</div>
