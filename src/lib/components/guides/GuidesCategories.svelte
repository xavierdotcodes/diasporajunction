<script>
	import * as Card from '$lib/components/ui/card/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-[#050505] py-20 text-white">
	<div class="mx-auto max-w-7xl px-6 md:px-10">
		<div class="mb-10 max-w-2xl">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFBC03]">Categories</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				Find the lane that matches where you are.
			</h2>
		</div>

		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			{#each items as item}
				<a href={`/guides/category/${item.slug}`} class="block">
					<Card.Root
						class="h-full rounded-3xl border-white/10 bg-white/5 text-white shadow-none transition hover:bg-white/10"
					>
						<Card.Content class="p-8">
							<h3 class="font-heading text-2xl font-bold">{item.title}</h3>
							<p class="mt-3 text-sm leading-6 text-white/70">
								{item.description}
							</p>
						</Card.Content>
					</Card.Root>
				</a>
			{/each}
		</div>
	</div>
</section>
