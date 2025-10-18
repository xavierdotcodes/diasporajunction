<script>
	import Slideshow from './Slideshow.svelte';
	export let steps = [];
</script>

<div class="space-y-12">
	{#each steps as step, i}
		<div
			class="flex flex-col md:flex-row gap-6 items-center md:items-start
                {i % 2 === 1 ? 'md:flex-row-reverse' : ''}"
		>
			<div class="md:w-1/2">
				<Slideshow images={step.images} />
			</div>
			<div class="md:w-1/2">
				<h3 class="text-xl font-bold mb-2">{step.day}: {step.title}</h3>
				<p class="text-gray-700">{step.copy}</p>
			</div>
		</div>
	{/each}
</div>
