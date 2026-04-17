<script>
	import { fade } from 'svelte/transition';
	import TourList from './TourList.svelte';
	import PatronsList from './PatronsList.svelte';
	import PatronModal from './PatronModal.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/ToursPanel.svelte');

	let { tours = [], patrons = [] } = $props();

	let selectedTour = $state(null);
	let hoveredPatron = $state(null);
	let showModal = $state(false);

	function handleTourSelect(tour) {
		selectedTour = tour;
	}

	function handlePatronHover(patron) {
		hoveredPatron = patron;
		showModal = true;
	}

	function handlePatronLeave() {
		showModal = false;
	}
</script>

<div class="flex flex-col md:flex-row gap-6 p-4">
	<div class="flex-1">
		<TourList {tours} on:select={(e) => handleTourSelect(e.detail)} />
	</div>

	<div class="flex-1 relative">
		<PatronsList
			patrons={selectedTour ? selectedTour.patrons : []}
			on:hover={(e) => handlePatronHover(e.detail)}
			on:leave={handlePatronLeave}
		/>

		{#if showModal && hoveredPatron}
			<div in:fade out:fade class="absolute top-0 left-full ml-2 z-50">
				<PatronModal {hoveredPatron} />
			</div>
		{/if}
	</div>
</div>
