<script>
	import LeadCaptureInline from '$lib/components/lead/LeadCaptureInline.svelte';
	import AccessCardGrid from '$lib/components/shared/AccessCardGrid.svelte';
	import LockedPreview from '$lib/components/shared/LockedPreview.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
	import { fileLogger } from '$lib/utils/logger';
	import { allGuides, featuredGuides, guideCategories } from '$lib/components/guides/data.js';

	fileLogger('free.guides.page');

	const featuredGuideCards = featuredGuides.map((item, index) => ({
		title: item.title,
		description: item.description,
		href: item.href,
		cta: 'Read guide',
		access: 'Free',
		eyebrow: item.category,
		accent: ['red', 'gold', 'green'][index % 3]
	}));

	const selectedGuideCards = allGuides.slice(0, 6).map((item, index) => ({
		title: item.title,
		description: item.description,
		href: item.href,
		cta: 'Open',
		access: 'Free',
		eyebrow: item.category,
		accent: ['dark', 'gold', 'green', 'red'][index % 4]
	}));

	const guideDepthPreview = [
		{
			title: 'Member-only follow-up reads',
			description:
				'More specific guidance for the questions that show up after the first round of reading and research.'
		},
		{
			title: 'Current field notes and updates',
			description:
				'More recent on-the-ground insight for people who need something more current than a public evergreen guide.'
		},
		{
			title: 'Trusted resources and referrals',
			description:
				'The next layer after information: who to talk to, where to go, and what paths are worth exploring.'
		},
		{
			title: 'Deeper decision support',
			description:
				'Stronger context, comparisons, and community-based insight for people making more serious moves.'
		}
	];
</script>

<div class="guides-page">
	<section class="guides-hero">
		<div class="page-shell hero-grid">
			<div class="hero-copy">
				<p class="eyebrow">Guides</p>
				<h1>Practical Ghana guides for the diaspora.</h1>
				<p>
					If you are trying to visit, relocate, invest, or simply understand what life in Ghana
					actually feels like, start here. These guides help you move with more clarity, fewer blind
					spots, and a better sense of what to expect.
				</p>
			</div>

			<div class="hero-panel">
				<p class="panel-kicker">What You’ll Find</p>
				<ul>
					<li>Real-world guidance for visiting and relocating</li>
					<li>Clearer context around culture, logistics, and decision-making</li>
					<li>A better starting point before you make bigger moves</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Featured Guides"
				title="Start with the guides people need most."
				description="These are some of the most useful entry points for understanding the move, the lifestyle shift, and the practical realities behind the Ghana conversation."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={featuredGuideCards} />
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Browse By Topic"
				title="Find the lane that matches where you are."
				description="Whether you are still curious, actively planning, or already making moves, these categories help you get to the right information faster."
				tone="dark"
			/>

			<div class="category-grid">
				{#each guideCategories as category, index}
					<article class={`category-card cat-${index + 1}`}>
						<h3>{category.title}</h3>
						<p>{category.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Public Library"
				title="Open guides to help you move with more confidence."
				description="Read through a growing collection of public resources designed to help you think more clearly about life, movement, and opportunity in Ghana."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={selectedGuideCards} columns={3} />
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell narrow-shell">
			<LeadCaptureInline
				title="Want a grounded place to start?"
				description={`Get the free guide: ${DEFAULT_LEAD_MAGNET_NAME}`}
				buttonText="Send Me the Guide"
				source="guides_page"
				leadMagnet={DEFAULT_LEAD_MAGNET_NAME}
				entryPage="/guides"
			/>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<LockedPreview
				eyebrow="Go Deeper"
				title="Some things make more sense with context, updates, and real community."
				description="The public guides help you get oriented. Inside Community, the conversation gets more current, more specific, and more useful for real decisions."
				items={guideDepthPreview}
				ctaHref="/community"
				ctaLabel="See Community"
			/>
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<StrategicCta
				eyebrow="Next Step"
				title="Start with the guides. Go deeper when you need more than articles."
				description="Use the public library to learn. Step into Community when you want sharper insight, better context, and a more connected next move."
				primaryHref="/community"
				primaryLabel="Explore Community"
				secondaryHref="/relocate"
				secondaryLabel="Explore Relocate"
			/>
		</div>
	</section>
</div>

<style>
	.guides-page {
		background: #f8f2df;
		color: #111111;
	}

	.page-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.narrow-shell {
		width: min(100%, 68rem);
	}

	.page-section {
		padding: clamp(4.5rem, 7vw, 6.5rem) 0;
	}

	.section-cream {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.section-dark,
	.guides-hero {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 24rem),
			radial-gradient(circle at bottom right, rgba(3, 140, 37, 0.12), transparent 26rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.guides-hero {
		padding: clamp(5rem, 8vw, 7rem) 0 4rem;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.72fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: end;
	}

	.eyebrow,
	.panel-kicker {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.eyebrow {
		color: rgba(242, 183, 5, 0.88);
	}

	.hero-copy h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.45rem, 5vw, 4.9rem);
		line-height: 0.94;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}

	.hero-copy p:not(.eyebrow) {
		margin: 1.15rem 0 0;
		font-size: clamp(1rem, 1.3vw, 1.14rem);
		line-height: 1.8;
		color: rgba(255, 248, 239, 0.8);
	}

	.hero-panel {
		padding: 1.45rem;
		border-radius: 1.8rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.16), transparent 58%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
		box-shadow: 0 24px 56px rgba(0, 0, 0, 0.16);
	}

	.panel-kicker {
		margin-bottom: 0.85rem;
		color: rgba(242, 183, 5, 0.88);
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
		color: rgba(255, 248, 239, 0.82);
	}

	.spacer-lg {
		height: 2rem;
	}

	.category-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 2rem;
	}

	.category-card {
		padding: 1.35rem;
		border-radius: 1.6rem;
		box-shadow: 0 20px 46px rgba(0, 0, 0, 0.14);
	}

	.cat-1,
	.cat-4 {
		background: linear-gradient(180deg, #d9042b 0%, #b10323 100%);
		color: white;
	}

	.cat-2,
	.cat-5 {
		background: linear-gradient(180deg, #f2b705 0%, #dfa200 100%);
		color: #111111;
	}

	.cat-3,
	.cat-6 {
		background: linear-gradient(180deg, #038c25 0%, #026b1d 100%);
		color: white;
	}

	.category-card h3 {
		margin: 0;
		font-size: 1.3rem;
		line-height: 1.04;
		letter-spacing: -0.03em;
	}

	.category-card p {
		margin: 0.8rem 0 0;
		font-size: 0.96rem;
		line-height: 1.72;
		opacity: 0.88;
	}

	@media (max-width: 960px) {
		.page-shell {
			padding-inline: 1rem;
		}

		.hero-grid,
		.category-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
