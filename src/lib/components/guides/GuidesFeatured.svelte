<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-white py-20 text-black">
	<div class="mx-auto max-w-7xl px-6 md:px-10">
		<div class="mb-10 max-w-2xl">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D9042B]">Featured</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				Start with the highest-leverage reads.
			</h2>
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			{#each items as item}
				<Card.Root class="flex h-full flex-col rounded-3xl border-black/5 shadow-sm">
					<Card.Header class="space-y-4">
						<Badge
							variant="outline"
							class="w-fit border-[#038C25]/20 bg-[#038C25]/5 text-[#038C25]"
						>
							{item.category}
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
							class="w-full rounded-full border-[#D9042B]/20 text-[#D9042B] hover:bg-[#D9042B]/5"
						>
							Read Guide
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</div>
</section>
