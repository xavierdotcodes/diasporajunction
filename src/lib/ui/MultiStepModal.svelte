<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/ui/MultiStepModal.svelte');

	let { children } = $props();

	let step = $state(0);
	let stepElements = $state([]);
	let totalSteps = $state(0);
	let stepsContainer = $state();

	onMount(() => {
		stepElements = Array.from(stepsContainer?.children ?? []);
		totalSteps = stepElements.length;
	});

	function next() {
		if (step < totalSteps - 1) step++;
	}
	function prev() {
		if (step > 0) step--;
	}

	$effect(() => {
		const activeStep = stepElements[step];
		if (!activeStep) return;

		gsap.fromTo(
			activeStep,
			{ opacity: 0, y: 10 },
			{ opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
		);
	});
</script>

<div class="fixed inset-0 bg-black/60 flex justify-center items-center p-4">
	<div class="relative bg-neutral-900 rounded-2xl w-full max-w-md overflow-hidden p-6">
		<!-- Step Slot Container -->
		<div bind:this={stepsContainer}>
			{@render children?.()}
		</div>

		<!-- Navigation -->
		<div class="mt-6 flex justify-between items-center text-sm text-gray-400">
			{#if step > 0}
				<button onclick={prev} class="hover:text-white">← Back</button>
			{/if}
			<div class="flex-1 text-center">{step + 1} / {totalSteps}</div>
			{#if step < totalSteps - 1}
				<button onclick={next} class="hover:text-white">Next →</button>
			{/if}
		</div>
	</div>
</div>
