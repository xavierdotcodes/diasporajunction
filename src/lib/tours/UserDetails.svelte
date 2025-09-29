<script>
	export let formData;
</script>

<div class="flex flex-col gap-4 p-4">
	<h2 class="text-2xl font-bold mb-2 text-gray-900">Your Details</h2>

	<input
		type="text"
		placeholder="Full Name"
		bind:value={formData.name}
		class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
	/>

	<input
		type="email"
		placeholder="Email"
		bind:value={formData.email}
		class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
	/>

	<input
		type="tel"
		placeholder="Phone"
		bind:value={formData.phone}
		class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
	/>

	<textarea
		placeholder="Notes"
		bind:value={formData.notes}
		class="w-full p-3 rounded border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
		rows="4"
	></textarea>
</div>

<style>
	/* Optional: subtle hover/focus styles for better visibility */
	input:hover,
	textarea:hover,
	input:focus,
	textarea:focus {
		border-color: #f2b705;
	}
</style>
