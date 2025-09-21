<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const close = () => dispatch('close');
</script>

<div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
	<div class="bg-white rounded-xl p-8 max-w-lg w-full shadow-xl relative">
		<button class="absolute top-3 right-3 text-gray-500 hover:text-gray-700" on:click={close}>
			✕
		</button>

		<h2 class="text-2xl font-bold text-[#038C25] mb-4">Reserve Your Tour</h2>
		<p class="mb-6 text-gray-700">
			Fill in your details below to reserve your spot for the 10-day Ghana immersion experience.
		</p>

		<form class="space-y-4">
			<input type="text" placeholder="Full Name" class="w-full border p-3 rounded-lg" required />
			<input
				type="email"
				placeholder="Email Address"
				class="w-full border p-3 rounded-lg"
				required
			/>
			<input type="tel" placeholder="Phone Number" class="w-full border p-3 rounded-lg" />
			<textarea placeholder="Special requests" class="w-full border p-3 rounded-lg"></textarea>
			<button
				type="submit"
				class="w-full bg-[#D9042B] hover:bg-[#F27405] text-white font-semibold py-3 rounded-lg"
			>
				Confirm Reservation
			</button>
		</form>
	</div>
</div>
