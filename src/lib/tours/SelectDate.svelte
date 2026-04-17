<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/tours/SelectDate.svelte');

	let { tours = [], formData = $bindable() } = $props();
</script>

<h2 class="text-xl font-bold mb-4 text-gray-800">Select Tour Date</h2>

{#if tours.length > 0}
	<div class="space-y-3">
		{#each tours as tour}
			<label
				class="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
			>
				<input
					type="radio"
					bind:group={formData.tourDate}
					value={tour.id}
					class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
				/>
				<span class="text-gray-700">
					{tour.name} — {new Date(tour.startDate).toLocaleDateString()} to
					{new Date(tour.endDate).toLocaleDateString()}
				</span>
			</label>
		{/each}

		<label
			class="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
		>
			<input
				type="radio"
				bind:group={formData.tourDate}
				value="custom"
				class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
			/>
			<span class="text-gray-700 font-medium">Custom request</span>
		</label>
	</div>
{:else}
	<p class="text-gray-500 italic">No tour dates available at this time.</p>
{/if}
