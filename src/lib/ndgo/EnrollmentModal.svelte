	<script>
	import gsap from 'gsap';
	import { fileLogger } from '$lib/utils/logger';

	const log = fileLogger('src/lib/ndgo/EnrollmentModal.svelte');

	let { showModal = false, onClose = () => {} } = $props();

	let modalEl = $state();
	let backdropEl = $state();

	let formData = $state({
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
	});

	const submitForm = () => {
		if (!formData.agree) {
			log.warn({ phase: 'ndgo_enrollment_submit_blocked', reason: 'agreement_missing' });
			alert('You must agree to the terms before submitting.');
			return;
		}
		log.info({
			phase: 'ndgo_enrollment_submitted',
			emailDomain: formData.email?.split('@')[1],
			program: formData.program,
			level: formData.level
		});
		alert('Registration submitted successfully!');
		onClose();
	};

	function handleSubmit(event) {
		event.preventDefault();
		submitForm();
	}

	$effect(() => {
		if (showModal && backdropEl && modalEl) {
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
				onclick={onClose}
			>
				✕
			</button>
			<h3 class="text-2xl font-bold mb-4 text-center">NDGO Registration</h3>
			<form onsubmit={handleSubmit} class="space-y-4">
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

<style></style>
