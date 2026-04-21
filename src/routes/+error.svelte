<script>
	import { page } from '$app/state';

	const status = $derived(page.status ?? 404);
	const message = $derived(
		page.error?.message ??
			'The page you were looking for may have moved, expired, or never existed.'
	);
</script>

<section
	class="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black px-6 py-20 text-white"
>
	<!-- Background -->
	<div class="absolute inset-0">
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,183,5,0.18),transparent_38%)]"
		></div>
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(217,4,43,0.12),transparent_30%)]"
		></div>
		<div
			class="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.82),rgba(0,0,0,0.96))]"
		></div>
		<div
			class="absolute inset-0 opacity-[0.06]"
			style="background-image:
				linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
				linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
				background-size: 28px 28px;"
		></div>
	</div>

	<div class="relative z-10 mx-auto w-full max-w-4xl text-center">
		<p class="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[#F2B705]">
			{status} · Wrong Turn
		</p>

		<h1
			class="mx-auto max-w-3xl font-heading text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl md:text-7xl"
		>
			You’re off the map —
			<span class="text-[#F2B705]">but not lost.</span>
		</h1>

		<p
			class="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base md:text-lg md:leading-8"
		>
			{message}
		</p>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
			<a
				href="/start-here"
				class="inline-flex items-center justify-center rounded-full bg-[#038C25] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#026B1D]"
			>
				Start Here
			</a>

			<a
				href="/relocate"
				class="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
			>
				Relocate
			</a>

			<a
				href="/blog"
				class="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
			>
				Blog
			</a>

			<a
				href="/"
				class="inline-flex items-center justify-center rounded-full border border-[#D9042B]/40 bg-[#D9042B]/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D9042B]/20"
			>
				Back Home
			</a>
		</div>

		<div class="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm">
			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<p
						class="mb-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#038C25]"
					>
						Best next step
					</p>
					<h2 class="font-heading text-2xl font-bold text-white">Start with clarity</h2>
					<p class="mt-3 text-sm leading-7 text-white/75">
						If you’re exploring Ghana through relocation, belonging, or long-term opportunity, the
						best entry point is our Start Here page.
					</p>
				</div>

				<div>
					<p
						class="mb-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#F2B705]"
					>
						Useful paths
					</p>
					<ul class="space-y-2 text-sm text-white/75">
						<li><a href="/start-here" class="transition hover:text-white">/start-here</a></li>
						<li><a href="/relocate" class="transition hover:text-white">/relocate</a></li>
						<li><a href="/blog" class="transition hover:text-white">/blog</a></li>
						<li><a href="/about" class="transition hover:text-white">/about</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>
