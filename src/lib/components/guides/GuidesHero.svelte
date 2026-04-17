<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="relative overflow-hidden bg-black text-white">
	<div class="absolute inset-0">
		<img
			src="/images/landing/culture.webp"
			alt="DiasporaJunxion guides"
			class="h-full w-full object-cover opacity-20"
		/>
		<div class="absolute inset-0 bg-black/75"></div>
	</div>

	<div class="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
		<div class="max-w-3xl space-y-6">
			<Badge variant="outline" class="border-[#FFBC03] bg-[#FFBC03]/10 text-[#FFBC03]">
				DiasporaJunxion Guides
			</Badge>

			<h1 class="font-heading text-4xl font-extrabold tracking-tight md:text-6xl">
				Grounded guidance for moving, living, and building in Ghana.
			</h1>

			<p class="max-w-2xl text-base leading-7 text-white/80 md:text-lg">
				This is the practical knowledge layer of DiasporaJunxion — relocation, family life,
				belonging, investment intrigue, and the realities people need before making the move.
			</p>

			<div class="flex flex-col gap-3 sm:flex-row">
				<Button
					href="/guides/start-here"
					class="rounded-full bg-[#038C25] text-white hover:bg-[#02701d]"
				>
					Start Here
				</Button>
				<Button
					href="/relocate"
					variant="outline"
					class="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
				>
					Explore Relocation
				</Button>
			</div>
		</div>
	</div>
</section>
