<script>
	import AccessCardGrid from '$lib/components/shared/AccessCardGrid.svelte';
	import LockedPreview from '$lib/components/shared/LockedPreview.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { fileLogger } from '$lib/utils/logger';
	import { investPillars, investPrinciples, investSectors } from '$lib/components/invest/data.js';

	fileLogger('free.invest.page');

	const publicInvestCards = investPillars.map((item, index) => ({
		title: item.title,
		description: item.description,
		access: 'Preview',
		accent: ['red', 'gold', 'green'][index % 3]
	}));

	const sectorCards = investSectors.map((item, index) => ({
		title: item.title,
		description: item.description,
		eyebrow: item.tag,
		access: 'Preview',
		accent: ['dark', 'gold', 'green', 'red'][index % 4]
	}));
</script>

<svelte:head>
	<title>Invest in Ghana | DiasporaJunxion</title>
	<meta
		name="description"
		content="Explore diaspora investment context, opportunity, and grounded guidance around Ghana through DiasporaJunxion."
	/>
</svelte:head>

<div class="invest-page">
	<section class="invest-hero">
		<div class="page-shell hero-grid">
			<div class="hero-copy">
				<p class="eyebrow">Invest</p>
				<h1>Explore opportunity in Ghana without losing your judgment.</h1>
				<p>
					If you are thinking about Ghana through the lens of business, investment, or long-term
					participation, start here for grounded context. The goal is to help you ask better
					questions, move more carefully, and avoid treating excitement like due diligence.
				</p>
			</div>

			<div class="hero-panel">
				<p class="panel-kicker">Use This Page To</p>
				<ul>
					<li>Get a clearer feel for where opportunity may exist</li>
					<li>Understand the cautions before money starts moving</li>
					<li>Learn the posture that usually leads to better decisions</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Start With The Basics"
				title="The best first move is understanding the terrain before you try to act on it."
				description="These are the ideas that help people think more clearly about risk, timing, local context, and what meaningful participation actually asks of you."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={publicInvestCards} />
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Where People Usually Look"
				title="These are some of the areas people tend to explore first."
				description="Use these as starting points for your thinking, not as shortcuts around research, relationships, or careful judgment."
				tone="dark"
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={sectorCards} tone="dark" columns={3} />
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<LockedPreview
				eyebrow="When The Questions Get More Serious"
				title="Some of the most useful insight shows up after the first round of reading."
				description="That is where current signals, trusted introductions, and more nuanced context start to matter more than broad public content."
				items={[
					{
						title: 'Vetted operators and builders',
						description: 'The people side of opportunity, where trust and discernment matter at least as much as the asset class.'
					},
					{
						title: 'Current market signals',
						description: 'What feels active now, what looks overheated, and what deserves more patience before commitment.'
					},
					{
						title: 'Deeper case studies',
						description: 'Nuanced examples that help people think about participation, not just extraction or speculative excitement.'
					},
					{
						title: 'Resource access',
						description: 'The more practical support layer that belongs inside Community or a future premium builder lane.'
					}
				]}
				ctaHref="/community"
				ctaLabel="See What Community Includes"
			/>
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Before You Commit"
				title="A better opportunity lens usually starts with a better posture."
				description="These principles are here to help you move with more discernment, patience, and respect for local reality."
				tone="dark"
			/>

			<ol class="principles-grid" aria-label="Investment principles">
				{#each investPrinciples as item, index}
					<li class={`principle-card tone-${index + 1}`}>
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
			<StrategicCta
				tone="light"
				eyebrow="Next Step"
				title="Start here for context. Go deeper when you need better signal and more trusted support."
				description="If the question is still early, keep reading. If the question is becoming real, Community is where the more current and practical layer starts."
				primaryHref="/community"
				primaryLabel="See What Community Includes"
				secondaryHref="/start-here"
				secondaryLabel="Start Here"
			/>
		</div>
	</section>
</div>

<style>
	.invest-page {
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

	.section-dark,
	.invest-hero {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 24rem),
			radial-gradient(circle at bottom right, rgba(3, 140, 37, 0.12), transparent 26rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.invest-hero {
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

	.principles-grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
		margin: 2rem 0 0;
		padding: 0;
	}

	.principle-card {
		display: grid;
		gap: 0.9rem;
		padding: 1.35rem;
		border-radius: 1.6rem;
		box-shadow: 0 20px 46px rgba(0, 0, 0, 0.16);
	}

	.tone-1,
	.tone-4 {
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

	.principle-card span {
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

	.principle-card h3 {
		margin: 0;
		font-size: 1.28rem;
		line-height: 1.05;
		letter-spacing: -0.03em;
	}

	.principle-card p {
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
		.principles-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
