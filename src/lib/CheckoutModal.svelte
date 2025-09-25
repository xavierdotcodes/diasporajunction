<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import CustomerInfo from '$lib/CustomerInfo.svelte';

	const dispatch = createEventDispatcher();

	let step = 1;
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

	function closeModal() {
		dispatch('close');
	}

	function goNext() {
		if (step === 1) step = 2;
		else submitForm();
	}

	function submitForm() {
		console.log('Submitting order:', { customer, paymentMethod });
		alert('Form submitted! (Check console)');
		closeModal();
	}
</script>

{#if true}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		on:click={(e) => e.target === e.currentTarget && closeModal()}
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
				class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
				on:click={closeModal}
			>
				✕
			</button>

			<h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">
				{step === 1 ? 'Your Information' : 'Payment Method'}
			</h2>

			<!-- Step 1: Customer Info -->
			{#if step === 1}
				<CustomerInfo bind:customer />
			{/if}

			<!-- Step 2: Payment Method -->
			{#if step === 2}
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

				<!-- Payment Forms -->
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
			{/if}

			<!-- Step Controls -->
			<div class="flex justify-between mt-6">
				{#if step === 2}
					<button
						type="button"
						class="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
						on:click={() => (step = 1)}
					>
						Back
					</button>
				{/if}

				<button
					type="button"
					on:click={goNext}
					class="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg"
				>
					{step === 1 ? 'Next' : 'Complete Order'}
				</button>
			</div>
		</div>
	</div>
{/if}
