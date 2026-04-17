<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="relative overflow-hidden bg-black text-white">
	<div class="absolute inset-0">
		<img
			src="/images/landing/innovation.webp"
			alt="Diaspora opportunity in Ghana"
			class="h-full w-full object-cover opacity-20"
		/>
		<div class="absolute inset-0 bg-black/75"></div>
	</div>

	<div class="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
		<div class="max-w-3xl space-y-6">
			<Badge variant="outline" class="border-[#FFBC03] bg-[#FFBC03]/10 text-[#FFBC03]">
				Diaspora Opportunity
			</Badge>

			<h1 class="font-heading text-4xl font-extrabold tracking-tight md:text-6xl">
				Invest in Ghana with more context and less guesswork.
			</h1>

			<p class="max-w-2xl text-base leading-7 text-white/80 md:text-lg">
				DiasporaJunxion explores the intersection of relocation, opportunity, local context, and
				long-term participation in Ghana’s future.
			</p>

			<div class="flex flex-col gap-3 sm:flex-row">
				<Button
					href="/guides/what-diaspora-investors-should-know-before-starting"
					class="rounded-full bg-[#038C25] text-white hover:bg-[#02701d]"
				>
					Start With the Basics
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
