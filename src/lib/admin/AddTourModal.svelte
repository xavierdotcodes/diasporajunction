<script>
	import { fly, fade } from 'svelte/transition';
	import AddTourForm from './AddTourForm.svelte';

	export let open = false;
	export let onClose;
	export let onTourAdded;

	function handleClose() {
		if (onClose) onClose();
	}

	function handleTourAdded(event) {
		if (onTourAdded) onTourAdded(event.detail);
		handleClose();
	}
</script>

<!--AddTourModal -->
{#if open}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	>
		<div
			class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
			in:fly={{ y: -20, duration: 300 }}
			out:fade={{ duration: 200 }}
		>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold">Add New Tour</h2>
				<button on:click={handleClose} class="text-gray-500 hover:text-gray-700"> ✖ </button>
			</div>

			<AddTourForm on:tourAdded={handleTourAdded} />
		</div>
	</div>
{/if}
