<script>
	import { fade } from 'svelte/transition';
	import CustomerInfoForm from '$lib/payment/CustomerInfoForm.svelte';
	import PaymentForm from '$lib/payment/PaymentForm.svelte';

	export let onClose = () => {};

	let step = 1; // 1 = Customer Info, 2 = Payment
	let customer = {
		name: '',
		email: '',
		street: '',
		apt: '',
		city: '',
		state: '',
		country: '',
		zip: ''
	};
	let paymentMethod = '';
	let paymentDetails = {};

	// close on ESC key
	function handleKeydown(e) {
		if (e.key === 'Escape') onClose();
	}

	function nextStep() {
		step = 2;
	}

	function prevStep() {
		step = 1;
	}

	function submitForm() {
		console.log('Order Submitted:', { customer, paymentMethod, paymentDetails });
		alert('Order submitted! Check console.');
		onClose();
	}
</script>

<!-- Overlay -->
<div
	class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-wrapper"
	on:click={(e) => e.target === e.currentTarget && onClose()}
	on:keydown={handleKeydown}
	tabindex="0"
	in:fade
	out:fade
>
	<!-- Scrollable Content -->
	<div
		class="bg-white shadow-xl rounded-2xl w-full max-w-lg p-6 space-y-6 relative overflow-y-auto max-h-[90vh] modal-content"
		tabindex="0"
	>
		<!-- Close Button -->
		<button
			type="button"
			class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
			on:click={onClose}>✕</button
		>

		<h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">Checkout</h2>

		<!-- Step 1: Customer Info -->
		{#if step === 1}
			<CustomerInfoForm bind:customer />

			<div class="flex justify-end mt-4">
				<button
					class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
					on:click={nextStep}
				>
					Next
				</button>
			</div>
		{/if}

		<!-- Step 2: Payment -->
		{#if step === 2}
			<PaymentForm bind:paymentMethod bind:paymentDetails />

			<div class="flex justify-between mt-4">
				<button
					class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition"
					on:click={prevStep}
				>
					Back
				</button>
				<button
					class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
					on:click={submitForm}
				>
					Complete Order
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.modal-wrapper {
		overscroll-behavior: contain;
	}

	.modal-content {
		transform: translateZ(0);
		backface-visibility: hidden;
	}

	/* Scrollbar styling */
	.modal-content::-webkit-scrollbar {
		width: 8px;
	}
	.modal-content::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}
</style>
