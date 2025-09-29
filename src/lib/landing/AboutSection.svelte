<script>
	export let title = 'What is DiasporaJunxion?';
	export let paragraphs = [];
</script>

<section class="py-12 sm:py-16 px-4 sm:px-6 text-center bg-gradient-to-b from-black to-gray-900">
	<div class="max-w-4xl mx-auto">
		<h3 class="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">{title}</h3>
		{#each paragraphs as p}
			<p class="text-sm sm:text-base md:text-lg mb-3 sm:mb-4">{@html p}</p>
		{/each}
	</div>
</section>
