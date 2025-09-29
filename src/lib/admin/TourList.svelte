<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import TourItem from './TourItem.svelte';

	export let tours = [];
	const dispatch = createEventDispatcher();

	function handleSelect(tour) {
		dispatch('select', tour);
	}
</script>

{#if tours.length === 0}
	<p class="text-gray-500 text-center py-4">No tours available.</p>
{:else}
	<div class="space-y-2">
		{#each tours as tour (tour.id)}
			<!-- Wrap component in a div to apply fade -->
			<div transition:fade={{ duration: 300 }}>
				<TourItem {tour} on:click={() => handleSelect(tour)} />
			</div>
		{/each}
	</div>
{/if}

<style>
	p {
		font-size: 1rem;
		color: #9ca3af; /* gray-400 */
		padding: 1rem 0;
		text-align: center;
	}
	.space-y-2 > :global(*) + :global(*) {
		margin-top: 0.5rem;
	}
</style>
