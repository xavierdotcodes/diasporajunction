<script>
	import { stopPropagation as stopPropagation_1 } from 'svelte/legacy';

	import { fly, fade, scale } from 'svelte/transition';
	import AddTourForm from './AddTourForm.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/admin/AddTourModal.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {boolean} [open]
	 * @property {any} onClose
	 * @property {any} onTourAdded
	 */

	/** @type {Props} */
	let { open = false, onClose, onTourAdded } = $props();

	function handleClose() {
		if (onClose) onClose();
	}

	function handleTourAdded(event) {
		if (onTourAdded) onTourAdded(event.detail);
		handleClose();
	}

	// stop click inside modal from closing
	function stopPropagation(event) {
		event.stopPropagation();
	}

	function handleBackdropKeydown(event) {
		if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClose();
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm"
		role="button"
		tabindex="0"
		aria-label="Close add tour modal"
		onclick={handleClose}
		onkeydown={handleBackdropKeydown}
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	>
		<div
			class="modal-card bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative transform transition-all"
			role="dialog"
			aria-modal="true"
			aria-labelledby="add-tour-modal-title"
			tabindex="-1"
			onclick={stopPropagation_1(stopPropagation)}
			onkeydown={stopPropagation}
			in:fly={{ y: -20, duration: 300 }}
			out:scale={{ duration: 200, start: 0.95 }}
		>
			<!-- Header -->
			<div class="flex justify-between items-center mb-6 border-b pb-2">
				<h2 id="add-tour-modal-title" class="text-2xl font-bold text-gray-900">Add New Tour</h2>
				<button
					onclick={handleClose}
					class="text-gray-400 hover:text-gray-700 rounded-full p-1 transition-colors duration-200"
					aria-label="Close modal"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Form -->
			<AddTourForm ontourAdded={handleTourAdded} />
		</div>
	</div>
{/if}

<style>
	.modal-card {
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		/* Remove fixed max-width to hug form content */
		display: inline-block;
		min-width: 300px;
	}

	.modal-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
	}

	:global(body) {
		overflow: hidden; /* prevent scrolling when modal open */
	}
</style>
