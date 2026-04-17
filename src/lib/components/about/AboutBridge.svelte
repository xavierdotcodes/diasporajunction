<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-white py-20 text-black">
	<div class="mx-auto max-w-6xl px-6 md:px-10">
		<div class="mb-10 max-w-3xl">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFBC03]">
				The two sides
			</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">Two lanes. One bridge.</h2>
			<p class="mt-4 text-base leading-7 text-black/70">
				DiasporaJunxion lives between diaspora return and African entrepreneurship. Right now the
				public front door leans relocation-first, but the deeper architecture holds both.
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			{#each items as item, i}
				<Card.Root class="h-full rounded-3xl border-black/5 shadow-sm">
					<Card.Content class="p-8">
						<Badge
							variant="outline"
							class={i === 0
								? 'mb-4 border-[#038C25]/20 bg-[#038C25]/5 text-[#038C25]'
								: 'mb-4 border-[#D9042B]/20 bg-[#D9042B]/5 text-[#D9042B]'}
						>
							{i === 0 ? 'Front Door' : 'Long-Term Vision'}
						</Badge>

						<h3 class="font-heading text-2xl font-bold text-black">{item.title}</h3>
						<p class="mt-4 text-sm leading-7 text-black/70">
							{item.description}
						</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</section>
