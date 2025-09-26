<script>
	import { onMount, afterUpdate } from 'svelte';
	import gsap from 'gsap';

	export let showModal = false;
	export let onClose = () => {};

	let modalEl; // ref for animation container
	let backdropEl;

	let formData = {
		fullName: '',
		dob: '',
		gender: '',
		phone: '',
		email: '',
		address: '',
		school: '',
		level: '',
		program: '',
		parentName: '',
		parentRelation: '',
		parentPhone: '',
		parentEmail: '',
		motivation: '',
		agree: false
	};

	const submitForm = () => {
		if (!formData.agree) {
			alert('You must agree to the terms before submitting.');
			return;
		}
		console.log('Form Submitted:', formData);
		alert('Registration submitted successfully!');
		onClose();
	};

	// Animate when modal is shown
	afterUpdate(() => {
		if (showModal) {
			gsap.fromTo(backdropEl, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
			gsap.fromTo(
				modalEl,
				{ opacity: 0, y: 40, scale: 0.9 },
				{ opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
			);
		}
	});
</script>

{#if showModal}
	<div
		bind:this={backdropEl}
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
	>
		<div
			bind:this={modalEl}
			class="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 relative overflow-y-auto max-h-[90vh]"
		>
			<button
				class="absolute top-4 right-4 text-gray-500 hover:text-black font-bold"
				on:click={onClose}
			>
				✕
			</button>
			<h3 class="text-2xl font-bold mb-4 text-center">NDGO Registration</h3>
			<form on:submit|preventDefault={submitForm} class="space-y-4">
				<!-- Form fields remain the same -->
				<!-- ... -->
				<div class="text-center">
					<button
						type="submit"
						class="bg-[#038C25] text-white px-6 py-3 rounded-full hover:bg-[#026b1d] transition"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	input,
	select,
	textarea {
		outline: none;
	}
</style>
