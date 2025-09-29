<script>
	import { createEventDispatcher } from 'svelte';
	import { addTour } from '$lib/client/helpers.js';

	const dispatch = createEventDispatcher();

	let tour = {
		price: '',
		startDate: '',
		endDate: ''
	};

	let error = '';
	let loading = false;

	async function handleSubmit(e) {
		e.preventDefault();
		error = '';
		loading = true;

		// Validation
		if (!tour.price || isNaN(Number(tour.price))) {
			error = 'Price must be a number.';
			loading = false;
			return;
		}
		if (!tour.startDate || !tour.endDate) {
			error = 'Both start and end dates are required.';
			loading = false;
			return;
		}
		if (new Date(tour.endDate) < new Date(tour.startDate)) {
			error = 'End date cannot be before start date.';
			loading = false;
			return;
		}

		try {
			const response = await addTour(tour);
			dispatch('tourAdded', response.tour);

			// Reset form
			tour = { price: '', startDate: '', endDate: '' };
		} catch (err) {
			console.error('Add tour failed:', err);
			error = err.message || 'Failed to add tour';
		} finally {
			loading = false;
		}
	}
</script>

<div class="bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto">
	{#if error}
		<p class="text-red-400 text-center mb-4">{error}</p>
	{/if}

	<form on:submit={handleSubmit} class="space-y-5">
		<!-- Price -->
		<div>
			<label class="block mb-2 text-white font-medium">Price (USD)</label>
			<div class="flex">
				<span class="px-4 py-3 bg-gray-700 text-white rounded-l-lg">$</span>
				<input
					type="number"
					bind:value={tour.price}
					min="0"
					step="0.01"
					class="w-full p-3 rounded-r-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
					placeholder="0.00"
					disabled={loading}
				/>
			</div>
		</div>

		<!-- Start Date -->
		<div>
			<label class="block mb-2 text-white font-medium">Start Date</label>
			<input
				type="date"
				bind:value={tour.startDate}
				class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
				disabled={loading}
			/>
		</div>

		<!-- End Date -->
		<div>
			<label class="block mb-2 text-white font-medium">End Date</label>
			<input
				type="date"
				bind:value={tour.endDate}
				class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
				disabled={loading}
			/>
		</div>

		<!-- Submit -->
		<button
			type="submit"
			class="w-full flex justify-center items-center bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-full transition disabled:opacity-60"
			disabled={loading}
		>
			{#if loading}
				<svg
					class="animate-spin h-5 w-5 mr-2 text-black"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
					></path>
				</svg>
				Saving...
			{:else}
				Save Tour
			{/if}
		</button>
	</form>
</div>

<style>
	input:focus,
	textarea:focus {
		outline: none;
	}
</style>
