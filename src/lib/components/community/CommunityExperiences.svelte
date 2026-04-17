<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-[#050505] py-20 text-white">
	<div class="mx-auto max-w-7xl px-6 md:px-10">
		<div class="mb-10 max-w-2xl">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#038C25]">
				What community can look like
			</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				Connection has more than one doorway.
			</h2>
		</div>

		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			{#each items as item}
				<Card.Root class="h-full rounded-3xl border-white/10 bg-white/5 text-white shadow-none">
					<Card.Content class="p-8">
						<Badge
							variant="outline"
							class="mb-4 w-fit border-[#FFBC03]/40 bg-[#FFBC03]/10 text-[#FFBC03]"
						>
							{item.tag}
						</Badge>

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
