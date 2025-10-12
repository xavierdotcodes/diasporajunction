<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import SelectDate from './SelectDate.svelte';
	import UserDetails from './UserDetails.svelte';
	import PaymentOption from './PaymentOption.svelte';

	const dispatch = createEventDispatcher();

	export let tours = [];

	let step = 1;
	let formData = {
		tourDate: '',
		paymentOption: '',
		name: '',
		email: '',
		phone: '',
		notes: ''
	};

	const next = () => (step = Math.min(step + 1, 3));
	const back = () => (step = Math.max(step - 1, 1));

	const submit = () => {
		console.log('Reservation submitted:', formData);
		dispatch('close');
	};

	// validation flags
	$: canProceed =
		(step === 1 && tours.length > 0 && formData.tourDate) ||
		(step === 2 && formData.name && formData.email) ||
		step === 3; // always can submit

	// handle overlay click
	function handleOverlayClick(e) {
		if (e.target === e.currentTarget) {
			dispatch('close');
		}
	}
</script>

<!-- Modal Overlay -->
<div
	class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-6 sm:px-6 backdrop-blur-sm"
	on:click={handleOverlayClick}
	in:fade={{ duration: 200 }}
	out:fade={{ duration: 200 }}
>
	<!-- Modal Card -->
	<div
		class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-[90vh]"
		in:scale={{ start: 0.96, duration: 250 }}
		out:scale={{ end: 0.96, duration: 200 }}
	>
		<!-- Close Button -->
		<button
			class="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
			on:click={() => dispatch('close')}
		>
			✕
		</button>

		<!-- Steps Indicator -->
		<div class="mb-6 flex justify-center gap-2 text-sm font-semibold">
			<div
				class={`px-3 py-1 rounded-full ${step === 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
			>
				1. Select Date
			</div>
			<div
				class={`px-3 py-1 rounded-full ${step === 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
			>
				2. Your Details
			</div>
			<div
				class={`px-3 py-1 rounded-full ${step === 3 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
			>
				3. Payment
			</div>
		</div>

		<!-- Step Content -->
		{#if step === 1}
			<SelectDate {tours} bind:formData />
		{:else if step === 2}
			<UserDetails bind:formData />
		{:else if step === 3}
			<PaymentOption bind:formData />
		{/if}

		<!-- Navigation Buttons -->
		<div class="flex justify-between mt-8 pt-4 border-t">
			{#if step > 1}
				<button
					on:click={back}
					class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
				>
					Back
				</button>
			{/if}

			{#if step < 3}
				<button
					on:click={next}
					class="ml-auto px-6 py-2 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
					class:bg-green-600={canProceed}
					class:hover:bg-green-700={canProceed}
					class:bg-gray-400={!canProceed}
					disabled={!canProceed}
				>
					Next →
				</button>
			{:else}
				<button
					on:click={submit}
					class="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
				>
					Submit ✔
				</button>
			{/if}
		</div>
	</div>
</div>
