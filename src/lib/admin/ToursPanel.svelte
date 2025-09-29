<script>
	import { fade } from 'svelte/transition';
	import TourList from './TourList.svelte';
	import PatronsList from './PatronsList.svelte';
	import PatronModal from './PatronModal.svelte';

	export let tours = [];
	export let patrons = [];

	let selectedTour = null;
	let hoveredPatron = null;
	let showModal = false;

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
