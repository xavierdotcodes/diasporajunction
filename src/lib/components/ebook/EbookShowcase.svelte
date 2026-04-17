<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="bg-white py-20 text-black">
	<div class="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center md:px-10">
		<div>
			<Badge variant="outline" class="mb-4 border-[#038C25]/20 bg-[#038C25]/5 text-[#038C25]">
				Paid Guide
			</Badge>

			<h2 class="font-heading text-3xl font-extrabold md:text-5xl">
				Thriving in Ghana (With Children)
			</h2>

			<p class="mt-4 text-base leading-7 text-black/70">
				A grounded guide for diaspora parents and future movers thinking seriously about life in
				Ghana beyond the travel fantasy.
			</p>

			<ul class="mt-6 space-y-3 text-sm text-black/70">
				<li>Structured, not scattered</li>
				<li>Built for real-life decisions</li>
				<li>Especially useful for families and long-term thinkers</li>
			</ul>

			<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
				<Button href="/ebook" class="rounded-full bg-[#D9042B] text-white hover:bg-[#b50323]">
					View the Ebook
				</Button>

				<div class="text-sm font-semibold text-black/55">$15</div>
			</div>
		</div>

		<div class="rounded-[2rem] border border-black/5 bg-[#f8f8f8] p-6 shadow-sm">
			<div
				class="aspect-[4/5] w-full rounded-[1.5rem] bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#2a2a2a] p-8 text-white"
			>
				<div class="flex h-full flex-col justify-between">
					<div>
						<div class="text-sm uppercase tracking-[0.2em] text-[#FFBC03]">DiasporaJunxion</div>
						<h3 class="mt-6 font-heading text-3xl font-extrabold leading-tight">
							Thriving in Ghana
							<br />
							<span class="text-[#038C25]">(With Children)</span>
						</h3>
					</div>

					<p class="max-w-xs text-sm leading-6 text-white/70">
						A practical and emotional guide for diaspora families considering life in Ghana.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
