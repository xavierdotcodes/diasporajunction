<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-white py-20 text-black">
	<div class="mx-auto max-w-7xl px-6 md:px-10">
		<div class="mb-10 max-w-3xl">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFBC03]">
				Choose your next lane
			</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				You do not need every answer. You just need the right next doorway.
			</h2>
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			{#each items as item}
				<Card.Root class="flex h-full flex-col rounded-3xl border-black/5 shadow-sm">
					<Card.Content class="flex h-full flex-col p-8">
						<h3 class="font-heading text-2xl font-bold text-black">{item.title}</h3>
						<p class="mt-4 text-sm leading-7 text-black/70">
							{item.description}
						</p>

						<div class="mt-6">
							<Button
								href={item.href}
								variant="outline"
								class="rounded-full border-[#038C25]/20 text-[#038C25] hover:bg-[#038C25]/5"
							>
								{item.cta}
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</section>
