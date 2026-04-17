<script>
	import Hero from '$lib/ui/Hero.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import CTASection from '$lib/landing/CTASection.svelte';
	import PillarCard from '$lib/ui/PillarCard.svelte';
	import Title from '$lib/ui/Title.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/routes/+page.svelte');

	const pillars = [
		{
			title: 'Relocation',
			description:
				'We help diaspora travelers, returners, and families think more clearly about moving to Ghana with grounded context instead of guesswork.',
			icon: '🏡',
			image: '/images/landing/connection.webp'
		},
		{
			title: 'Guidance',
			description:
				'From cost of living to family rhythms to the difference between visiting and living, we create practical guidance for real-life decisions.',
			icon: '🧭',
			image: '/images/landing/innovation.webp'
		},
		{
			title: 'Culture',
			description:
				'To know Ghana, you need more than logistics. You need rhythm, places, people, food, nightlife, and the living texture of the culture.',
			icon: '🎶',
			image: '/images/landing/culture.webp'
		},
		{
			title: 'Community',
			description:
				'DiasporaJunxion is about more than information. It is about belonging, trusted pathways, and feeling less alone in the move.',
			icon: '🫱🏾‍🫲🏽',
			image: '/images/landing/collaboration.webp'
		},
		{
			title: 'Opportunity',
			description:
				'Beyond relocation, we hold space for long-term participation through investment intrigue, local connection, and the bridge into African possibility.',
			icon: '🌍',
			image: '/images/landing/impact1.webp'
		}
	];

</script>

<svelte:head>
	<title>DiasporaJunxion | Relocate, Connect, and Build in Ghana</title>
	<meta
		name="description"
		content="DiasporaJunxion helps diaspora travelers, returners, and families move toward Ghana with more clarity, connection, and opportunity."
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="landing font-sans bg-black text-white overflow-x-hidden">
	<!-- HERO -->
	<Hero
		subtitle="A bridge for diaspora relocation, belonging, and opportunity in Ghana"
		description={`<span class="font-bold text-white">Ghana</span> is more than a destination — for many in the diaspora, it is a question, a pull, and a possible next chapter.<br/>
			Some come searching for reconnection. Some come for family, peace, culture, or a better life rhythm.<br/>
			Some come wondering whether they can truly build here.<br/><br/>
			<span class="text-[#FFBC03] font-semibold">DiasporaJunxion</span> exists to help you move with more clarity —
			to relocate, connect, and step into Ghana with grounded guidance instead of fantasy.`}
		desktopVideoSrc="/videos/desktop_landing-hero.mp4"
		desktopPosterSrc="/videos/covers/desktop_landing-hero-cover.jpg"
		mobileVideoSrc="/videos/mobile_landing-hero.mp4"
		mobilePosterSrc="/videos/covers/mobile_landing-hero-cover.jpg"
	>
		{#snippet logo()}
			<Logo src="/images/logos/diasporajunxion-icon.png" width="200" />
		{/snippet}

		{#snippet title()}
			<Title />
		{/snippet}

		{#snippet cta()}
			<a
				href="/start-here"
				class="inline-block bg-[#038C25] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#026b1d] transition"
			>
				Start Here
			</a>
		{/snippet}
	</Hero>

	<!-- WHAT IS DIASPORAJUNXION -->
	<section id="about" class="bg-white text-black py-20 px-6 md:px-16 text-center">
		<h2 class="text-4xl md:text-5xl font-extrabold mb-6">
			What Is <span class="text-[#D9042B]">DiasporaJunxion</span>?
		</h2>

		<p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
			DiasporaJunxion is a relocation, connection, and opportunity hub for diaspora people exploring
			life in Ghana. We help future movers, returners, and families think more clearly about what it
			means to come, settle, belong, and build.
		</p>

		<p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
			Right now, we lead with grounded guidance around relocation, community, culture, and
			opportunity. Over time, that bridge expands into a deeper ecosystem connecting diaspora
			participation with African creativity, entrepreneurship, and long-term development.
		</p>

		<h3 class="text-2xl font-bold text-gray-900 mb-8 mt-16">
			More Than a Move — The Ecosystem Around It
		</h3>

		<div class="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto">
			<div class="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition text-center">
				<div class="text-4xl mb-4 flex justify-center">📘</div>
				<h4 class="font-bold text-xl mb-2 text-[#038C25]">Relocation Guides</h4>
				<p class="text-gray-700 leading-relaxed">
					Practical content for diaspora people thinking about Ghana — from visiting vs living to
					cost of living, family life, and how to move with more clarity.
				</p>
			</div>

			<div class="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition text-center">
				<div class="text-4xl mb-4 flex justify-center">🤝</div>
				<h4 class="font-bold text-xl mb-2 text-[#FFBC03]">Community & Connection</h4>
				<p class="text-gray-700 leading-relaxed">
					A softer landing into Ghana through belonging, trusted pathways, social rhythm, and
					connection to the people and places that make life here real.
				</p>
			</div>

			<div class="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition text-center">
				<div class="text-4xl mb-4 flex justify-center">🌍</div>
				<h4 class="font-bold text-xl mb-2 text-[#D9042B]">Opportunity & Long-Term Vision</h4>
				<p class="text-gray-700 leading-relaxed">
					For those thinking beyond the move, DiasporaJunxion also explores the bridge into
					investment intrigue, local partnerships, and African entrepreneurship over time.
				</p>
			</div>
		</div>

		<p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mt-16">
			Together, these layers create a more grounded path into Ghana — one built on context,
			connection, and the possibility of deeper participation.
		</p>
	</section>

	<!-- PILLARS -->
	<section id="pillars" class="py-20 bg-[#111] text-white text-center">
		<h2 class="text-4xl md:text-5xl font-extrabold mb-12">
			Our <span class="text-[#FFBC03]">Pillars</span>
		</h2>

		<div class="space-y-20 max-w-6xl mx-auto px-6 md:px-8 overflow-hidden">
			{#each pillars as pillar, i}
				<PillarCard {...pillar} reverse={i % 2 !== 0} />
			{/each}
		</div>
	</section>

	<!-- OUR APPROACH -->
	<section id="approach" class="bg-white text-black py-20 px-6 md:px-16 text-center">
		<h2 class="text-4xl md:text-5xl font-extrabold mb-10 text-[#D9042B]">Our Approach</h2>
		<p class="text-lg text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
			We help people move toward Ghana through a simple three-step path —
			<span class="text-[#038C25] font-semibold">Orient</span>,
			<span class="text-[#FFBC03] font-semibold">Connect</span>, and
			<span class="text-[#D9042B] font-semibold">Build</span>.
		</p>

		<div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			<div
				class="approach-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center"
			>
				<div class="text-4xl mb-4">🧭</div>
				<h4 class="text-xl font-semibold text-[#038C25] mb-2">Orient</h4>
				<p class="text-gray-700 text-sm leading-relaxed">
					We help you understand the terrain — the emotional, practical, and cultural realities of
					moving toward life in Ghana.
				</p>
			</div>
			<div
				class="approach-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center"
			>
				<div class="text-4xl mb-4">🤝</div>
				<h4 class="text-xl font-semibold text-[#FFBC03] mb-2">Connect</h4>
				<p class="text-gray-700 text-sm leading-relaxed">
					We create pathways into community, trusted context, and the social rhythm that helps the
					move feel more human and less isolating.
				</p>
			</div>
			<div
				class="approach-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center"
			>
				<div class="text-4xl mb-4">🌍</div>
				<h4 class="text-xl font-semibold text-[#D9042B] mb-2">Build</h4>
				<p class="text-gray-700 text-sm leading-relaxed">
					For those thinking long-term, we hold space for opportunity, participation, and the bridge
					between diaspora presence and African possibility.
				</p>
			</div>
		</div>

		<p class="mt-12 text-gray-700 max-w-3xl mx-auto text-lg">
			From first questions to deeper roots —
			<span class="text-[#038C25] font-semibold">we help build the bridge</span>.
		</p>
	</section>

	<!-- WHY WE EXIST -->
	<section id="story" class="py-20 bg-white px-8 text-center">
		<h3 class="text-3xl font-bold text-black mb-8">Why We Exist</h3>
		<div class="max-w-3xl mx-auto text-gray-700 space-y-4 text-lg">
			<p>
				We built DiasporaJunxion because more people in the diaspora are feeling the pull toward
				Ghana — not just as a place to visit, but as a place to reconnect, relocate, and possibly
				build a different kind of life.
			</p>
			<p>
				That pull is real. But inspiration without context can turn into confusion. We exist to help
				people move with more clarity, connection, and trust — so Ghana can feel less like an
				abstract dream and more like a lived, grounded possibility.
			</p>
			<p>
				This is more than a relocation brand. It is a bridge between diaspora belonging and the
				larger future of participation, culture, and African opportunity.
			</p>
		</div>
	</section>

	<!-- CTA -->
	<CTASection />
</div>

<style>
	@media (max-width: 768px) {
		h2 {
			font-size: 1.8rem;
		}
	}
	@media (orientation: landscape) and (max-width: 900px) {
		.landing {
			padding-bottom: 4rem;
		}
	}
	@media (min-width: 1024px) {
		h2 {
			font-size: 2.5rem;
		}
	}
</style>
