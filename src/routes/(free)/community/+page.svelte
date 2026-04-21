<script>
	import AccessCardGrid from '$lib/components/shared/AccessCardGrid.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import LockedPreview from '$lib/components/shared/LockedPreview.svelte';
	import { TOURS_MEDIA } from '$lib/components/shared/media.js';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('free.community.page');

	const calendlyHref = 'https://calendly.com/diaspora-junxion/consult';

	const communityValueCards = [
		{
			eyebrow: '45-Minute Consult',
			title: 'Talk through your real questions',
			description:
				'Bring the questions you are actually holding about relocating, family life, belonging, timing, or whether Ghana fits your season.',
			access: 'Included',
			accent: 'dark'
		},
		{
			eyebrow: 'Practical Support',
			title: 'Get a clearer next step',
			description:
				'Leave with better questions, more grounded perspective, and a stronger sense of what you should do next.',
			access: 'Included',
			accent: 'gold',
			locked: false
		},
		{
			eyebrow: 'Lived Perspective',
			title: 'Get context beyond surface-level content',
			description:
				'Use the conversation to make sense of what articles cannot fully answer on their own: timing, fit, tradeoffs, and what people usually underestimate.',
			access: 'Included',
			accent: 'green',
			locked: false
		},
		{
			eyebrow: 'Family & Transition',
			title: 'Work through the move in real-life terms',
			description:
				'This is especially useful if you are thinking about Ghana with children, a partner, a business, or a life that cannot be moved on impulse.',
			access: 'Included',
			accent: 'red',
			locked: false
		},
		{
			eyebrow: 'Trusted Conversation',
			title: 'Move with less guesswork',
			description:
				'Instead of piecing together scattered opinions, use a focused conversation to get more signal and less noise.',
			access: 'Included',
			accent: 'dark',
			locked: false
		}
	];
</script>

<div class="community-page">
	<Hero
		variant="page"
		subtitle="Community"
		description="If you want more than articles, book a focused 45-minute consult to talk through the real decision with more clarity, better questions, and less guesswork."
		{...TOURS_MEDIA}
	>
		{#snippet title()}
			<h1>Book a 45-minute consult to talk through your Ghana questions with more clarity.</h1>
		{/snippet}

		{#snippet cta()}
			<div class="hero-actions">
				<a href={calendlyHref} class="hero-primary" target="_blank" rel="noreferrer">Book A 45-Minute Consult</a>
				<a href="/start-here" class="hero-secondary">Start Here First</a>
			</div>
		{/snippet}

		{#snippet aside()}
			<div class="hero-panel hero-panel-light">
				<p class="panel-kicker">Use The Consult To</p>
				<ul>
					<li>Talk through relocation, belonging, family, or timing questions</li>
					<li>Get clearer on what Ghana may ask of your real life</li>
					<li>Leave with a more practical next move</li>
				</ul>
			</div>
		{/snippet}
	</Hero>

	<section class="community-section section-cream">
		<div class="community-shell">
			<SectionHeader
				eyebrow="What This Helps With"
				title="Use the consult when your questions need more nuance than a public page can give."
				description="This is for people who want grounded support around Ghana, not vague reassurance or a hard sell."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={communityValueCards} />
		</div>
	</section>

	<section class="community-section section-dark">
		<div class="community-shell">
			<LockedPreview
				eyebrow="Why Book A Consult"
				title="Some of the most useful clarity comes from talking through your situation directly."
				description="A focused conversation can help you make sense of timing, tradeoffs, family considerations, relocation concerns, and the difference between a hopeful idea and a workable next step."
				items={[
					{
						title: 'Talk through your situation',
						description: 'Bring the real questions you are holding instead of trying to force your situation into generic advice.'
					},
					{
						title: 'Get a more grounded read',
						description: 'Use the session to separate fantasy, fear, and outside noise from what is actually relevant to your life.'
					},
					{
						title: 'Name the next step clearly',
						description: 'Leave knowing whether you should keep reading, plan a visit, prepare for relocation, or slow down and gather more information.'
					},
					{
						title: 'Make the move feel more real',
						description: 'This is especially useful when Ghana is starting to feel serious and you need practical clarity, not just inspiration.'
					}
				]}
				ctaHref={calendlyHref}
				ctaLabel="Book The Consult"
			/>
		</div>
	</section>

	<section class="community-section section-green">
		<div class="community-shell reason-grid">
			<div>
				<p class="eyebrow dark">Why This Matters</p>
				<h2>The move usually gets easier once you can stop guessing alone.</h2>
			</div>
			<div class="reason-copy">
				<p>
					The questions that matter most are often personal, situational, and hard to answer from
					public content alone, especially when family, money, identity, or timing are involved.
				</p>
				<p>
					A focused consult gives you room to think through the move with more signal, more honesty,
					and more grounded support once Ghana starts to feel like a real decision instead of a
					distant idea.
				</p>
			</div>
		</div>
	</section>

	<section id="join" class="community-section section-cream">
		<div class="community-shell join-grid">
			<div class="join-copy">
				<p class="eyebrow dark">45-Minute Consult</p>
				<h2>Book time if you want to talk through Ghana in a more personal, practical way.</h2>
				<p>
					Use the public site to get your bearings. Book a consult when you want to work through your
					questions directly and leave with a clearer sense of what to do next.
				</p>
			</div>

			<div class="pricing-panel">
				<p class="pricing-kicker">What To Expect</p>
				<div class="price-row">
					<div>
						<h3>45-minute conversation</h3>
						<p>A focused consult built around your real questions, not a generic presentation.</p>
					</div>
					<span>Online</span>
				</div>
				<div class="price-row featured">
					<div>
						<h3>Best for serious questions</h3>
						<p>Useful if you are weighing relocation, family transition, belonging, timing, or whether Ghana fits your real life.</p>
					</div>
					<span>45 min</span>
				</div>
				<div class="pricing-actions">
					<a href={calendlyHref} class="hero-primary" target="_blank" rel="noreferrer">Book The Consult</a>
					<a href="/start-here" class="hero-secondary dark">Start Here</a>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.community-page {
		background: #f8f2df;
		color: #111111;
	}

	.community-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.community-section {
		padding: clamp(4.75rem, 7vw, 6.5rem) 0;
	}

	.section-cream {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.section-dark {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 24rem),
			radial-gradient(circle at bottom right, rgba(217, 4, 43, 0.1), transparent 26rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.section-green {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 24rem),
			linear-gradient(180deg, #038c25 0%, #026b1d 100%);
		color: #111111;
	}

	.reason-grid,
	.join-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(19rem, 0.72fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: end;
	}

	.reason-grid h2,
	.join-copy h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.4rem, 5vw, 4.8rem);
		line-height: 0.94;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}

	.reason-copy p,
	.join-copy p:not(.eyebrow) {
		margin: 1.15rem 0 0;
		font-size: clamp(1rem, 1.3vw, 1.14rem);
		line-height: 1.8;
		color: rgba(17, 17, 17, 0.78);
	}

	.eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: rgba(217, 4, 43, 0.8);
	}

	.eyebrow.dark {
		color: rgba(17, 17, 17, 0.64);
	}

	.hero-actions,
	.pricing-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		margin-top: 1.6rem;
	}

	.hero-primary,
	.hero-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3.2rem;
		padding: 0 1.25rem;
		border-radius: 999px;
		font-size: 0.94rem;
		font-weight: 700;
		text-decoration: none;
	}

	.hero-primary {
		background: linear-gradient(135deg, #d9042b, #b10323);
		color: white;
	}

	.hero-secondary {
		background: rgba(17, 17, 17, 0.06);
		color: #111111;
	}

	.hero-secondary.dark {
		background: rgba(255, 255, 255, 0.12);
		color: white;
	}

	.hero-panel-light,
	.pricing-panel {
		padding: 1.45rem;
		border-radius: 1.8rem;
		box-shadow: 0 24px 56px rgba(0, 0, 0, 0.16);
	}

	.hero-panel-light {
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08)),
			linear-gradient(135deg, rgba(242, 183, 5, 0.08), transparent 48%);
		color: #111111;
		box-shadow: 0 24px 56px rgba(66, 66, 66, 0.12);
	}

	.pricing-panel {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 58%),
			linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		color: white;
	}

	.panel-kicker,
	.pricing-kicker {
		margin: 0 0 0.85rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.9);
	}

	.hero-panel-light .panel-kicker {
		color: rgba(17, 17, 17, 0.62);
	}

	.hero-panel-light ul {
		display: grid;
		gap: 0.8rem;
		margin: 0;
		padding-left: 1rem;
	}

	.hero-panel-light li {
		font-size: 0.96rem;
		line-height: 1.65;
		color: rgba(17, 17, 17, 0.78);
	}

	.spacer-lg {
		height: 2rem;
	}

	.reason-copy {
		display: grid;
		gap: 1rem;
	}

	.reason-copy p {
		color: rgba(17, 17, 17, 0.82);
	}

	.price-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 0;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.price-row:first-of-type {
		border-top: 0;
		padding-top: 0;
	}

	.price-row.featured span {
		color: #f2b705;
	}

	.price-row h3,
	.price-row p {
		margin: 0;
	}

	.price-row h3 {
		font-size: 1.1rem;
	}

	.price-row p {
		margin-top: 0.35rem;
		font-size: 0.94rem;
		line-height: 1.65;
		color: rgba(255, 248, 239, 0.76);
	}

	.price-row span {
		flex: 0 0 auto;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
	}

	@media (max-width: 960px) {
		.community-shell {
			padding-inline: 1rem;
		}

		.reason-grid,
		.join-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
