<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
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
		// TODO: send formData to your API/db
		console.log('Reservation:', formData);
		dispatch('close'); // close modal
	};
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
	<div class="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg relative">
		<button
			class="absolute top-3 right-3 text-gray-500 hover:text-black"
			on:click={() => dispatch('close')}
		>
			✕
		</button>

		{#if step === 1}
			<h2 class="text-xl font-bold mb-4">Select Tour Date</h2>
			<div class="space-y-3">
				<label
					><input type="radio" bind:group={formData.tourDate} value="Dec 1–10, 2025" /> Dec 1–10, 2025</label
				>
				<label
					><input type="radio" bind:group={formData.tourDate} value="Jan 15–24, 2026" /> Jan 15–24, 2026</label
				>
				<label
					><input type="radio" bind:group={formData.tourDate} value="Custom request" /> Custom request</label
				>
			</div>
		{/if}

		{#if step === 2}
			<h2 class="text-xl font-bold mb-4">Payment Option</h2>
			<label
				><input type="radio" bind:group={formData.paymentOption} value="Full" /> Pay in Full</label
			><br />
			<label
				><input type="radio" bind:group={formData.paymentOption} value="Installments" /> Installments</label
			>
		{/if}

		{#if step === 3}
			<h2 class="text-xl font-bold mb-4">Your Details</h2>
			<input
				placeholder="Full Name"
				bind:value={formData.name}
				class="border p-2 w-full mb-2 rounded"
			/>
			<input
				placeholder="Email"
				type="email"
				bind:value={formData.email}
				class="border p-2 w-full mb-2 rounded"
			/>
			<input
				placeholder="Phone"
				bind:value={formData.phone}
				class="border p-2 w-full mb-2 rounded"
			/>
			<textarea
				placeholder="Notes"
				bind:value={formData.notes}
				class="border p-2 w-full mb-2 rounded"
			></textarea>
		{/if}

		<!-- Navigation -->
		<div class="flex justify-between mt-6">
			{#if step > 1}
				<button on:click={back} class="px-4 py-2 bg-gray-200 rounded">Back</button>
			{/if}

			{#if step < 3}
				<button on:click={next} class="ml-auto px-4 py-2 bg-green-600 text-white rounded"
					>Next</button
				>
			{:else}
				<button on:click={submit} class="ml-auto px-4 py-2 bg-green-600 text-white rounded"
					>Submit</button
				>
			{/if}
		</div>
	</div>
</div>
