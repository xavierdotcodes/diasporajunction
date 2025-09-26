<script>
	import { fade } from 'svelte/transition';
	import CustomerInfo from '$lib/payment/CustomerInfo.svelte';

	export let onClose = () => {};

	let paymentMethod = '';
	let customer = {
		name: '',
		email: '',
		phone: '',
		street: '',
		apt: '',
		city: '',
		state: '',
		country: '',
		zip: ''
	};

	function submitForm() {
		console.log('Submitting order:', { customer, paymentMethod });
		alert('Form submitted! (Check console)');
		onClose();
	}

	// close on ESC key
	function handleKeydown(e) {
		if (e.key === 'Escape') onClose();
	}
</script>

<div
	class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
	on:click={(e) => e.target === e.currentTarget && onClose()}
	on:keydown={handleKeydown}
	tabindex="0"
	in:fade
	out:fade
>
	<div
		class="bg-white shadow-xl rounded-2xl w-full max-w-lg p-6 space-y-6 relative overflow-y-auto max-h-[90vh]"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	>
		<!-- Close Button -->
		<button
			type="button"
			class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
			on:click={onClose}
		>
			✕
		</button>

		<h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">Checkout</h2>

		<!-- Customer Info -->
		<CustomerInfo bind:customer />

		<!-- Payment Method Selection -->
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
				<button
					type="button"
					class="border rounded-lg py-2 px-4 text-sm font-medium transition hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500
						{paymentMethod === 'card'
						? 'bg-indigo-50 border-indigo-500 text-indigo-600'
						: 'border-gray-300 text-gray-700'}"
					on:click={() => (paymentMethod = 'card')}
				>
					Card
				</button>
				<button
					type="button"
					class="border rounded-lg py-2 px-4 text-sm font-medium transition hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500
						{paymentMethod === 'momo'
						? 'bg-indigo-50 border-indigo-500 text-indigo-600'
						: 'border-gray-300 text-gray-700'}"
					on:click={() => (paymentMethod = 'momo')}
				>
					MoMo
				</button>
				<button
					type="button"
					class="border rounded-lg py-2 px-4 text-sm font-medium transition hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500
						{paymentMethod === 'crypto'
						? 'bg-indigo-50 border-indigo-500 text-indigo-600'
						: 'border-gray-300 text-gray-700'}"
					on:click={() => (paymentMethod = 'crypto')}
				>
					Crypto
				</button>
			</div>
		</div>

		<!-- Payment Details Forms -->
		{#if paymentMethod === 'card'}
			<div transition:fade class="space-y-3">
				<input
					type="text"
					placeholder="Card Number"
					class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
				<div class="grid grid-cols-2 gap-3">
					<input
						type="text"
						placeholder="MM/YY"
						class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
					/>
					<input
						type="text"
						placeholder="CVC"
						class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
			</div>
		{/if}

		{#if paymentMethod === 'momo'}
			<div transition:fade class="space-y-3">
				<input
					type="tel"
					placeholder="MoMo Number"
					class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
				<input
					type="text"
					placeholder="Provider"
					class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>
		{/if}

		{#if paymentMethod === 'crypto'}
			<div transition:fade class="space-y-3">
				<input
					type="text"
					placeholder="Wallet Address"
					class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
				<select
					class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				>
					<option>USDT</option>
					<option>ETH</option>
					<option>BTC</option>
				</select>
			</div>
		{/if}

		<!-- Submit -->
		<button
			type="button"
			on:click={submitForm}
			class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg"
		>
			Complete Order
		</button>
	</div>
</div>
