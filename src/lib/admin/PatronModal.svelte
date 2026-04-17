<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/PatronModal.svelte');

	let { hoveredPatron } = $props();
</script>

<div class="p-4 bg-white rounded shadow-lg w-80">
	<h3 class="font-bold text-lg">{hoveredPatron.name}</h3>
	<p class="text-sm text-gray-600">{hoveredPatron.email}</p>

	<h4 class="mt-2 font-semibold">Reservations</h4>
	<ul class="text-sm text-gray-700 list-disc list-inside">
		{#each hoveredPatron.reservations as res}
			<li>
				{res.tour.name} - {res.isPaidInFull ? 'Paid' : 'Pending'}
				<br />
				{res.payments.length} payment(s)
			</li>
		{/each}
	</ul>
</div>
