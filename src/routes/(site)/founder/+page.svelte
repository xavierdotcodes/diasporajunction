<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/routes/(site)/founder/+page.svelte');

	const founder = {
		name: 'Xavi',
		role: 'Founder · Systems Builder · DiasporaJunxion',
		image: '/images/team/xavi.jpg',
		bio: `I built DiasporaJunxion from the belief that the journey between diaspora and homeland needs better bridges — not just inspiration, but structure, context, and real pathways into belonging.

My work sits at the intersection of culture, technology, and long-term systems thinking. Right now, DiasporaJunxion is focused on helping diaspora people move toward Ghana with more clarity, connection, and trust. Over time, that same bridge expands into deeper participation through community, opportunity, and African entrepreneurship.

I care about building things that reduce confusion, create orientation, and help people move from abstract longing into grounded action.`,
		socials: {
			x: 'https://twitter.com/mangoxsweat',
			linkedin: 'https://linkedin.com/in/xaviercooper',
			instagram: 'https://www.instagram.com/mangoxsweat'
		}
	};
</script>

<svelte:head>
	<title>Founder | DiasporaJunxion</title>
	<meta
		name="description"
		content="Meet Xavi, founder of DiasporaJunxion — a platform helping diaspora people move toward Ghana with more clarity, connection, and context."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="relative flex items-center justify-center bg-black py-32 text-white sm:py-40">
	<img
		src="/images/team/founder-hero.webp"
		alt="Xavi, Founder of DiasporaJunxion"
		class="absolute inset-0 h-full w-full object-cover opacity-45"
	/>
	<div class="absolute inset-0 bg-black/55"></div>

	<div class="relative z-10 max-w-4xl px-6 text-center">
		<p class="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#FFBC03]">
			Meet the Founder
		</p>
		<h1 class="mb-5 text-4xl font-extrabold leading-tight sm:text-6xl">
			Building a bridge between diaspora return and grounded possibility.
		</h1>
		<p class="mx-auto max-w-2xl text-lg text-white/80 sm:text-xl">
			DiasporaJunxion comes from a vision of helping people move toward Ghana with more clarity,
			belonging, and long-term connection.
		</p>
	</div>
</section>

<!-- Founder Profile Section -->
<section class="bg-white px-4 py-20 text-black">
	<div class="mx-auto max-w-5xl">
		<div class="grid items-center gap-12 md:grid-cols-[260px_1fr]">
			<div class="text-center">
				<div class="relative mx-auto mb-6 h-52 w-52">
					<img
						src={founder.image}
						alt={founder.name}
						class="h-full w-full rounded-full border-4 border-[#D9042B] object-cover shadow-xl"
					/>
				</div>
			</div>

			<div class="text-center md:text-left">
				<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#038C25]">
					Why this platform exists
				</p>

				<h2 class="mb-2 text-3xl font-extrabold text-[#D9042B] sm:text-4xl">{founder.name}</h2>
				<p class="mb-6 text-lg text-gray-700 sm:text-xl">{founder.role}</p>

				<div class="space-y-5 text-base leading-8 text-gray-600 sm:text-lg">
					{#each founder.bio.split('\n\n') as paragraph}
						<p>{paragraph}</p>
					{/each}
				</div>

				<div class="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
					{#if founder.socials.x}
						<a
							href={founder.socials.x}
							target="_blank"
							rel="noopener noreferrer"
							class="rounded-full border border-black/10 bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#D9042B]"
						>
							X
						</a>
					{/if}

					{#if founder.socials.linkedin}
						<a
							href={founder.socials.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							class="rounded-full border border-black/10 bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A66C2]"
						>
							LinkedIn
						</a>
					{/if}

					{#if founder.socials.instagram}
						<a
							href={founder.socials.instagram}
							target="_blank"
							rel="noopener noreferrer"
							class="rounded-full border border-black/10 bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#E4405F]"
						>
							Instagram
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Closing Section -->
<section class="bg-[#111] px-6 py-20 text-center text-white">
	<div class="mx-auto max-w-3xl">
		<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFBC03]">
			DiasporaJunxion
		</p>
		<h3 class="mb-6 text-3xl font-extrabold sm:text-4xl">
			More than a brand. A bridge in progress.
		</h3>
		<p class="text-lg leading-8 text-white/75">
			The work of DiasporaJunxion is to make the path toward Ghana feel less abstract and more lived
			— through guidance, community, culture, and long-term participation.
		</p>

		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<a
				href="/about"
				class="rounded-full bg-[#038C25] px-6 py-3 font-semibold text-white transition hover:bg-[#026b1d]"
			>
				About DiasporaJunxion
			</a>
			<a
				href="/start-here"
				class="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
			>
				Start Here
			</a>
		</div>
	</div>
</section>
