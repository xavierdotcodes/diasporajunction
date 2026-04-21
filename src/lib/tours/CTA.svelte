	<script>
	import { createEventDispatcher } from 'svelte';
	import { fileLogger } from '$lib/utils/logger';

	const log = fileLogger('src/lib/tours/CTA.svelte');
	const dispatch = createEventDispatcher();

	function handleDiscoveryCall() {
		log.info({ phase: 'cta_discovery_call_clicked' });
		dispatch('openDiscoveryCall');
	}

	function handleReservation() {
		log.info({ phase: 'cta_reservation_clicked' });
		dispatch('openReservationModal');
	}
</script>

<div class="bg-gradient-to-br from-[#F2B705] to-[#F29F05] text-white p-8 rounded-2xl shadow-xl">
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
		<!-- Text -->
		<div class="max-w-2xl">
			<h2 class="text-3xl font-bold leading-snug">🌍 Join the 10-Day Ghana Immersion</h2>
			<p class="mt-2 text-white/90">
				Accommodations, transport, meals, workshops, and cultural access — curated for connection,
				community, and meaning.
			</p>
		</div>

		<!-- Actions -->
		<div class="flex flex-col sm:flex-row gap-3 items-center">
			<!-- Discovery Call (opens Calendly modal) -->
			<button
				onclick={handleDiscoveryCall}
				class="bg-white text-[#F29F05] hover:bg-[#FFF8E1] transition px-6 py-3 rounded-full font-semibold text-center w-full sm:w-auto"
			>
				💬 Book a Discovery Call
			</button>

			<!-- Reserve Button -->
			<button
				onclick={handleReservation}
				class="bg-[#D9042B] hover:bg-[#F27405] px-6 py-3 rounded-full font-semibold text-white transition w-full sm:w-auto"
			>
				Reserve Your Spot
			</button>
		</div>
	</div>

	<!-- Subtext -->
	<p class="mt-4 text-sm text-white/90 text-center md:text-right">
		✨ Want to connect first? Book a discovery call — or jump straight to reserving your place.
	</p>
</div>
