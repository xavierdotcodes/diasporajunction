<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-white py-20 text-black">
	<div class="mx-auto max-w-7xl px-6 md:px-10">
		<div class="mb-10 max-w-2xl">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D9042B]">
				Where to begin
			</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				Start with the questions people actually have.
			</h2>
			<p class="mt-4 text-base leading-7 text-black/70">
				This section should act like a clean entry point into the relocation lane.
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
			{#each items as item}
				<Card.Root class="flex h-full flex-col rounded-3xl border-black/5 shadow-sm">
					<Card.Header class="space-y-4">
						<Badge
							variant="outline"
							class="w-fit border-[#FFBC03]/40 bg-[#FFBC03]/10 text-[#8a6300]"
						>
							{item.tag}
						</Badge>

						<div>
							<Card.Title class="text-2xl text-black">{item.title}</Card.Title>
							<Card.Description class="mt-2 text-sm leading-6 text-black/65">
								{item.description}
							</Card.Description>
						</div>
					</Card.Header>

					<Card.Footer class="mt-auto">
						<Button
							href={item.href}
							variant="outline"
							class="w-full rounded-full border-[#038C25]/20 text-[#038C25] hover:bg-[#038C25]/5"
						>
							Open Guide
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</div>
</section>
