<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let selectedCoin = 'usdt';

	function handleSubmit() {
		dispatch('submit', { type: 'crypto', coin: selectedCoin });
	}
</script>

<div class="bg-neutral-800 p-4 rounded-lg border border-neutral-600 space-y-3">
	<label class="block text-sm">Send Crypto To:</label>
	<p class="break-all text-indigo-400 font-mono">0xYourWalletAddressHere123456789abcdef</p>

	<select
		bind:value={selectedCoin}
		class="w-full p-3 rounded-lg bg-neutral-900 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
	>
		<option value="usdt">USDT</option>
		<option value="eth">ETH</option>
		<option value="btc">BTC</option>
	</select>

	<p class="text-sm text-gray-400">
		After sending, your order will be confirmed once the transaction is detected on-chain.
	</p>
</div>

<button
	class="w-full mt-4 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
	on:click={handleSubmit}
>
	I’ve Sent the Crypto
</button>
