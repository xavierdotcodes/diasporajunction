<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="border-t border-white/10 bg-[#0B0B0B] py-20 text-white">
	<div class="mx-auto max-w-5xl px-6 text-center md:px-10">
		<Badge class="mb-5 bg-[#F2B705]/16 text-[#F2B705] hover:bg-[#F2B705]/16">DiasporaJunxion</Badge>

		<h2 class="font-heading text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">
			Don’t move blind.
		</h2>

		<p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
			Start with clear guidance, real context, and a better feel for what relocation to Ghana
			actually asks of you.
		</p>

		<div class="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
			<Button href="/start-here">
				Read the Start Here Guide
			</Button>

			<Button
				href="/guides"
				variant="outline"
				class="border-white/20 text-white hover:bg-white/8"
			>
				Explore Guides
			</Button>
		</div>
	</div>
</section>
