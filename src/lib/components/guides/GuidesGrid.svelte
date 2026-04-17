<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-white py-20 text-black">
	<div class="mx-auto max-w-7xl px-6 md:px-10">
		<div class="mb-10 max-w-2xl">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#038C25]">All guides</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				The growing knowledge library.
			</h2>
		</div>

		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			{#each items as item}
				<a href={item.href} class="block">
					<Card.Root
						class="h-full rounded-3xl border-black/5 shadow-sm transition hover:-translate-y-0.5"
					>
						<Card.Content class="p-7">
							<Badge
								variant="outline"
								class="mb-4 border-[#FFBC03]/40 bg-[#FFBC03]/10 text-[#8a6300]"
							>
								{item.category}
							</Badge>

							<h3 class="font-heading text-xl font-bold text-black">
								{item.title}
							</h3>

							<p class="mt-3 text-sm leading-6 text-black/65">
								{item.description}
							</p>
						</Card.Content>
					</Card.Root>
				</a>
			{/each}
		</div>
	</div>
</section>
