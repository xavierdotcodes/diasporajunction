<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="relative overflow-hidden bg-black text-white">
	<div class="absolute inset-0">
		<img
			src="/images/landing/collaboration.webp"
			alt="Diaspora community in Ghana"
			class="h-full w-full object-cover opacity-20"
		/>
		<div class="absolute inset-0 bg-black/75"></div>
	</div>

	<div class="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
		<div class="max-w-3xl space-y-6">
			<Badge variant="outline" class="border-[#FFBC03] bg-[#FFBC03]/10 text-[#FFBC03]">
				Community
			</Badge>

			<h1 class="font-heading text-4xl font-extrabold tracking-tight md:text-6xl">
				Find your people, not just your place.
			</h1>

			<p class="max-w-2xl text-base leading-7 text-white/80 md:text-lg">
				DiasporaJunxion is about more than relocation logistics. It is also about connection,
				belonging, social rhythm, and trusted pathways into life in Ghana.
			</p>

			<div class="flex flex-col gap-3 sm:flex-row">
				<Button href="/relocate" class="rounded-full bg-[#038C25] text-white hover:bg-[#02701d]">
					Explore Relocation
				</Button>

				<Button
					href="/guides/how-to-meet-good-people-in-ghana"
					variant="outline"
					class="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
				>
					Read the Guide
				</Button>
			</div>
		</div>
	</div>
</section>
