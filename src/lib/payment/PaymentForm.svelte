<script>
	export let paymentMethod;
	export let paymentDetails = {};
</script>

<div class="space-y-4">
	<label class="block text-sm font-medium text-gray-700">Payment Method</label>
	<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
		<button
			type="button"
			class:active={paymentMethod === 'card'}
			on:click={() => (paymentMethod = 'card')}>Card</button
		>
		<button
			type="button"
			class:active={paymentMethod === 'momo'}
			on:click={() => (paymentMethod = 'momo')}>MoMo</button
		>
		<button
			type="button"
			class:active={paymentMethod === 'crypto'}
			on:click={() => (paymentMethod = 'crypto')}>Crypto</button
		>
	</div>

	{#if paymentMethod === 'card'}
		<input bind:value={paymentDetails.number} placeholder="Card Number" class="input" />
		<div class="grid grid-cols-2 gap-2">
			<input bind:value={paymentDetails.expiry} placeholder="MM/YY" class="input" />
			<input bind:value={paymentDetails.cvc} placeholder="CVC" class="input" />
		</div>
	{/if}

	{#if paymentMethod === 'momo'}
		<input bind:value={paymentDetails.number} placeholder="MoMo Number" class="input" />
		<input bind:value={paymentDetails.provider} placeholder="Provider" class="input" />
	{/if}

	{#if paymentMethod === 'crypto'}
		<input bind:value={paymentDetails.wallet} placeholder="Wallet Address" class="input" />
		<select bind:value={paymentDetails.coin} class="input">
			<option>USDT</option>
			<option>ETH</option>
			<option>BTC</option>
		</select>
	{/if}
</div>

<style>
	button {
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		padding: 0.5rem;
		font-size: 0.9rem;
		transition: all 0.2s;
	}
	button:hover {
		background: #f0f0f0;
	}
	.active {
		background: #e0e7ff;
		border-color: #6366f1;
		color: #4f46e5;
	}
	.input {
		width: 100%;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		padding: 0.5rem 0.75rem;
		font-size: 0.95rem;
	}
</style>
