<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="bg-[#F2B705] text-white p-6 rounded-xl shadow-lg mb-12">
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
		<div>
			<h2 class="text-2xl font-bold">🌍 10-Day Full Ghana Experience</h2>
			<p class="mt-1">
				Accommodations, transport, expert guides, meals, workshops, and curated cultural access.
			</p>
		</div>
		<div class="flex gap-3 items-center">
			<button
				on:click={() => dispatch('openReservationModal')}
				class="bg-[#D9042B] hover:bg-[#F27405] px-5 py-3 rounded-full font-semibold text-white"
			>
				Reserve Your Spot
			</button>
		</div>
	</div>
</div>
