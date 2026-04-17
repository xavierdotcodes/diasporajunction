<script>
	import * as Card from '$lib/components/ui/card/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-[#050505] py-20 text-white">
	<div class="mx-auto max-w-7xl px-6 md:px-10">
		<div class="mb-10 max-w-3xl">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D9042B]">Vision</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				What this grows into over time.
			</h2>
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			{#each items as item}
				<Card.Root class="h-full rounded-3xl border-white/10 bg-white/5 text-white shadow-none">
					<Card.Content class="p-8">
						<h3 class="font-heading text-2xl font-bold">{item.title}</h3>
						<p class="mt-4 text-sm leading-7 text-white/75">
							{item.description}
						</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</section>
