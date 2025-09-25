<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let number = '';
	let provider = '';

	function handleSubmit() {
		dispatch('submit', { type: 'momo', number, provider });
	}
</script>

<div class="bg-neutral-800 p-4 rounded-lg border border-neutral-600 space-y-3">
	<input
		type="tel"
		bind:value={number}
		placeholder="MoMo Number"
		class="w-full p-3 rounded-lg bg-neutral-900 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
	/>
	<input
		type="text"
		bind:value={provider}
		placeholder="Provider (MTN, Vodafone, AirtelTigo)"
		class="w-full p-3 rounded-lg bg-neutral-900 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
	/>
</div>

<button
	class="w-full mt-4 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
	on:click={handleSubmit}
>
	Pay with MoMo
</button>
