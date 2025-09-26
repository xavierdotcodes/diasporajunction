<script>
	import Panel from './Panel.svelte';
	export let tours = [];
	export let active = false;
</script>

<Panel {active}>
	{#each tours as tour}
		<div class="p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded shadow mb-2">
			{tour.name} — {tour.location} ({tour.startDate
				? new Date(tour.startDate).toLocaleDateString()
				: 'No date'})
		</div>
	{/each}
</Panel>
