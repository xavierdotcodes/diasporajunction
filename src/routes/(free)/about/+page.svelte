<script>
	import AboutFounder from '$lib/components/about/AboutFounder.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import AccessCardGrid from '$lib/components/shared/AccessCardGrid.svelte';
	import LockedPreview from '$lib/components/shared/LockedPreview.svelte';
	import { DIASPORAU_MEDIA } from '$lib/components/shared/media.js';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { fileLogger } from '$lib/utils/logger';
	import { aboutBridge, aboutVision, aboutWhat, aboutWhy } from '$lib/components/about/data.js';

	fileLogger('free.about.page');

	const whatCards = aboutWhat.map((item, index) => ({
		title: item.title,
		description: item.description,
		access: 'Free',
		accent: ['red', 'gold', 'green'][index % 3]
	}));

	const bridgeCards = aboutBridge.map((item, index) => ({
		title: item.title,
		description: item.description,
		access: 'Preview',
		accent: ['dark', 'gold'][index % 2]
	}));

	const visionCards = aboutVision.map((item, index) => ({
		title: item.title,
		description: item.description,
		access: index === 2 ? 'Gated' : 'Preview',
		accent: ['red', 'green', 'dark'][index % 3],
		locked: index === 2
	}));
</script>

<svelte:head>
	<title>About | DiasporaJunxion</title>
	<meta
		name="description"
		content="Learn what DiasporaJunxion is building at the intersection of diaspora relocation, belonging, and African opportunity."
	/>
</svelte:head>

<div class="about-page">
	<Hero
		variant="page"
		subtitle="About"
		description="DiasporaJunxion exists to help diaspora people think more clearly about Ghana before a visit, a move, or a bigger life decision starts running ahead of reality."
		{...DIASPORAU_MEDIA}
	>
		{#snippet title()}
			<h1>Why DiasporaJunxion exists, and how that helps you move with more trust.</h1>
		{/snippet}

		{#snippet aside()}
			<div class="hero-panel">
				<p class="panel-kicker">What You Should Leave With</p>
				<ul>
					<li>A clearer feel for the mission behind the site</li>
					<li>More trust in the lens shaping the guidance</li>
					<li>A better sense of how to use DiasporaJunxion well</li>
				</ul>
			</div>
		{/snippet}
	</Hero>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="What DiasporaJunxion Is"
				title="A relocation, belonging, and opportunity platform for diaspora people navigating Ghana."
				description="The public site helps people orient. The deeper platform layers create pathways into support, connection, and longer-term participation."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={whatCards} />
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Why It Exists"
				title="The pull toward Ghana is real. But longing without context is not enough."
				description="This is why DiasporaJunxion is being built as a layered platform instead of a random collection of content."
				tone="dark"
			/>

			<ol class="reason-grid" aria-label="Why DiasporaJunxion exists">
				{#each aboutWhy as item, index}
					<li class={`reason-card tone-${(index % 4) + 1}`}>
						<span>{item.step}</span>
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="The Bridge"
				title="The vision is designed to connect two sides at once."
				description="DiasporaJunxion is not just about arrival. It is also about what happens when diaspora energy, creativity, capital, and skill meet grounded local reality."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={bridgeCards} columns={2} />
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<LockedPreview
				eyebrow="Platform Direction"
				title="The long-term vision extends beyond public orientation."
				description="Some of that future remains preview-only in public because the deeper ecosystem is meant to live through Community, trusted pathways, and more intentional platform layers."
				items={[
					{
						title: 'Community depth',
						description: 'The gated layer for pulse, access, tools, and lived intelligence.'
					},
					{
						title: 'Builder ecosystem',
						description: 'Longer-term pathways between diaspora participation and African entrepreneurship.'
					},
					{
						title: 'Cultural and social bridge',
						description: 'Real connection to people, places, rhythm, and context instead of content alone.'
					},
					{
						title: 'Deeper support systems',
						description: 'More structured guidance for people moving from interest into action.'
					}
				]}
				ctaHref="/community"
				ctaLabel="Explore Community"
			/>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Where It Is Going"
				title="The platform grows in layers, not random additions."
				description="These are the platform directions already visible in the architecture."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={visionCards} />
		</div>
	</section>

	<AboutFounder />

	<section class="page-section section-dark">
		<div class="page-shell">
			<StrategicCta
				eyebrow="Next Step"
				title="Start with orientation. Move deeper when you need the platform, not just the pages."
				description="That is what DiasporaJunxion is becoming: a serious diaspora platform with a clear public layer and a clear deeper layer."
				primaryHref="/start-here"
				primaryLabel="Start Here"
				secondaryHref="/community"
				secondaryLabel="See Community"
			/>
		</div>
	</section>
</div>

<style>
	.about-page {
		background: #f8f2df;
		color: #111111;
	}

	.page-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.page-section {
		padding: clamp(4.5rem, 7vw, 6.5rem) 0;
	}

	.section-cream {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.section-dark {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 24rem),
			radial-gradient(circle at bottom right, rgba(217, 4, 43, 0.12), transparent 26rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.hero-panel {
		padding: 1.45rem;
		border-radius: 1.8rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08)),
			linear-gradient(135deg, rgba(242, 183, 5, 0.08), transparent 48%);
		box-shadow: 0 24px 56px rgba(66, 66, 66, 0.12);
	}

	.panel-kicker {
		margin: 0 0 0.85rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.62);
	}

	.hero-panel ul {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding-left: 1rem;
	}

	.hero-panel li {
		font-size: 0.96rem;
		line-height: 1.65;
		color: rgba(17, 17, 17, 0.78);
	}

	.spacer-lg {
		height: 2rem;
	}

	.reason-grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
		margin: 2rem 0 0;
		padding: 0;
	}

	.reason-card {
		display: grid;
		gap: 0.9rem;
		padding: 1.35rem;
		border-radius: 1.6rem;
		box-shadow: 0 20px 46px rgba(0, 0, 0, 0.16);
	}

	.tone-1 {
		background: linear-gradient(180deg, #d9042b 0%, #b10323 100%);
		color: white;
	}

	.tone-2 {
		background: linear-gradient(180deg, #f2b705 0%, #dfa200 100%);
		color: #111111;
	}

	.tone-3 {
		background: linear-gradient(180deg, #038c25 0%, #026b1d 100%);
		color: white;
	}

	.tone-4 {
		background: linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		color: white;
	}

	.reason-card span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.14);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.16em;
	}

	.tone-2 span {
		background: rgba(17, 17, 17, 0.1);
	}

	.reason-card h3 {
		margin: 0;
		font-size: 1.28rem;
		line-height: 1.05;
		letter-spacing: -0.03em;
	}

	.reason-card p {
		margin: 0;
		font-size: 0.96rem;
		line-height: 1.72;
		opacity: 0.86;
	}

	@media (max-width: 960px) {
		.page-shell {
			padding-inline: 1rem;
		}

		.hero-grid,
		.reason-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
