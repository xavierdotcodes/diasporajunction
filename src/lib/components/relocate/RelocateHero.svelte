<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="relative overflow-hidden bg-black text-white">
	<div class="absolute inset-0">
		<img
			src="/images/landing/connection.webp"
			alt="Diaspora relocation to Ghana"
			class="h-full w-full object-cover opacity-25"
		/>
		<div class="absolute inset-0 bg-black/70"></div>
	</div>

	<div class="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-6 py-20 md:px-10">
		<div class="max-w-3xl space-y-6">
			<Badge variant="outline" class="border-[#FFBC03] bg-[#FFBC03]/10 text-[#FFBC03]">
				Relocation Hub
			</Badge>

			<h1 class="font-heading text-4xl font-extrabold tracking-tight text-white md:text-6xl">
				Move to Ghana with more clarity, context, and connection.
			</h1>

			<p class="max-w-2xl text-base leading-7 text-white/80 md:text-lg">
				DiasporaJunxion helps diaspora travelers, returners, and families think through relocation
				with grounded guidance — not fantasy, not fluff.
			</p>

			<div class="flex flex-col gap-3 sm:flex-row">
				<Button
					href="/guides/start-here"
					class="rounded-full bg-[#038C25] text-white hover:bg-[#02701d]"
				>
					Start Here
				</Button>

				<Button
					href="/guides/visiting-vs-living-in-ghana"
					variant="outline"
					class="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
				>
					Visiting vs Living
				</Button>
			</div>

			<div class="grid gap-3 pt-6 text-sm text-white/75 sm:grid-cols-3">
				<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
					<div class="font-semibold text-white">Practical</div>
					<div>Housing, planning, family life, cost, and first steps.</div>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
					<div class="font-semibold text-white">Grounded</div>
					<div>No romanticized version of the move. Just real context.</div>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
					<div class="font-semibold text-white">Connected</div>
					<div>Relocation is easier when trust and people are in the loop.</div>
				</div>
			</div>
		</div>
	</div>
</section>
