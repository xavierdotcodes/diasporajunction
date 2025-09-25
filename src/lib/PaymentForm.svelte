<script>
	import { createEventDispatcher } from 'svelte';
	import CardPayment from './payments/CardPayment.svelte';
	import CryptoPayment from './payments/CryptoPayment.svelte';
	import MoMoPayment from './payments/MoMoPayment.svelte';

	const dispatch = createEventDispatcher();
	let paymentMethod = 'card';

	function handleBack() {
		dispatch('back');
	}

	function handleSubmit(event) {
		dispatch('submit', event.detail);
	}
</script>

<form class="space-y-4">
	<h2 class="text-xl font-bold mb-4 text-center">Payment Method</h2>

	<div class="space-y-3">
		<label
			class="flex items-center gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-600 cursor-pointer hover:border-indigo-500"
		>
			<input type="radio" bind:group={paymentMethod} value="card" class="accent-indigo-500" />
			Credit / Debit Card
		</label>

		<label
			class="flex items-center gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-600 cursor-pointer hover:border-indigo-500"
		>
			<input type="radio" bind:group={paymentMethod} value="crypto" class="accent-indigo-500" />
			Crypto Payment
		</label>

		<label
			class="flex items-center gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-600 cursor-pointer hover:border-indigo-500"
		>
			<input type="radio" bind:group={paymentMethod} value="momo" class="accent-indigo-500" />
			Mobile Money (MoMo)
		</label>
	</div>

	{#if paymentMethod === 'card'}
		<CardPayment on:submit={handleSubmit} />
	{:else if paymentMethod === 'crypto'}
		<CryptoPayment on:submit={handleSubmit} />
	{:else if paymentMethod === 'momo'}
		<MoMoPayment on:submit={handleSubmit} />
	{/if}

	<div class="flex justify-between mt-6">
		<button
			type="button"
			on:click={handleBack}
			class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
		>
			← Back
		</button>
	</div>
</form>
