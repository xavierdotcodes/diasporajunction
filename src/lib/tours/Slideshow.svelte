<script>
	import { fly, fade } from 'svelte/transition';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/tours/Slideshow.svelte');
	let { images = [] } = $props();
	let current = $state(0);

	const next = () => (current = (current + 1) % images.length);
	const prev = () => (current = (current - 1 + images.length) % images.length);
</script>

<div class="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg shadow-lg">
	{#if images.length}
		{#each images as img, index (index)}
			{#if index === current}
				<div class="absolute inset-0 w-full h-full" transition:fade={{ duration: 400 }}>
					<img src={img} alt="Slide" class="w-full h-full object-cover" />
				</div>
			{/if}
		{/each}

		<!-- Navigation buttons -->
		<button
			onclick={prev}
			class="absolute top-1/2 left-2 -translate-y-1/2 bg-[#FEBE05] text-black px-3 py-1 rounded hover:bg-[#F2A007] transition"
		>
			‹
		</button>
		<button
			onclick={next}
			class="absolute top-1/2 right-2 -translate-y-1/2 bg-[#FEBE05] text-black px-3 py-1 rounded hover:bg-[#F2A007] transition"
		>
			›
		</button>
	{/if}
</div>
