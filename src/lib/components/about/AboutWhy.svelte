<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let { items = [] } = $props();
</script>

<section class="bg-[#050505] py-20 text-white">
	<div class="mx-auto max-w-7xl px-6 md:px-10">
		<div class="mb-10 max-w-3xl">
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#038C25]">
				Why it exists
			</p>
			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				The pull is real. The need for better bridges is real too.
			</h2>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			{#each items as item}
				<Card.Root class="rounded-3xl border-white/10 bg-white/5 text-white shadow-none">
					<Card.Content class="p-8">
						<div class="mb-5 flex items-center gap-4">
							<div
								class="flex size-12 items-center justify-center rounded-full bg-[#D9042B] font-bold text-white"
							>
								{item.step}
							</div>
							<div class="text-xl font-bold">{item.title}</div>
						</div>

						<Separator class="mb-5 bg-white/10" />

						<p class="leading-7 text-white/75">
							{item.description}
						</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</section>
