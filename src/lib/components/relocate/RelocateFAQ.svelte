<script>
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-white py-20 text-black">
	<div class="mx-auto max-w-4xl px-6 md:px-10">
		<div class="mb-10 text-center">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFBC03]">FAQ</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				Questions people ask before they uproot their life.
			</h2>
		</div>

		<Accordion.Root type="single" collapsible class="w-full">
			{#each items as item}
				<Accordion.Item value={item.value} class="border-black/10">
					<Accordion.Trigger class="text-left text-base font-semibold md:text-lg">
						{item.question}
					</Accordion.Trigger>
					<Accordion.Content class="pb-5 text-sm leading-7 text-black/70 md:text-base">
						{item.answer}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
</section>
