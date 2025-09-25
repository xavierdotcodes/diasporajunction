<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let name = '';
	let email = '';
	let address = '';
	let city = '';
	let country = '';
</script>

<form class="space-y-4" on:submit|preventDefault={() => dispatch('next')}>
	<h2 class="text-xl font-bold mb-4 text-center">Customer Information</h2>

	<input
		type="text"
		bind:value={name}
		placeholder="Full Name"
		class="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
		required
	/>

	<input
		type="email"
		bind:value={email}
		placeholder="Email"
		class="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
		required
	/>

	<input
		type="text"
		bind:value={address}
		placeholder="Address"
		class="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
		required
	/>

	<div class="flex flex-col sm:flex-row gap-3">
		<input
			type="text"
			bind:value={city}
			placeholder="City"
			class="flex-1 p-3 rounded-lg bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			required
		/>
		<input
			type="text"
			bind:value={country}
			placeholder="Country"
			class="flex-1 p-3 rounded-lg bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			required
		/>
	</div>

	<button
		type="submit"
		class="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-3 rounded-lg"
	>
		Continue to Payment →
	</button>
</form>
