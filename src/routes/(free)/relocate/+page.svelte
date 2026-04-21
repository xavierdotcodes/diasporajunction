<script>
	import LeadCaptureInline from '$lib/components/lead/LeadCaptureInline.svelte';
	import AccessCardGrid from '$lib/components/shared/AccessCardGrid.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import LockedPreview from '$lib/components/shared/LockedPreview.svelte';
	import { APPROACH_MEDIA } from '$lib/components/shared/media.js';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
	import { fileLogger } from '$lib/utils/logger';
	import { relocateFaq, relocateQuickLinks, relocateSteps } from '$lib/components/relocate/data.js';

	fileLogger('free.relocate.page');

	const publicRelocateCards = relocateQuickLinks.map((item, index) => ({
		title: item.title,
		description: item.description,
		href: item.href,
		cta: 'Read now',
		access: 'Free',
		eyebrow: item.tag,
		accent: ['red', 'gold', 'green', 'dark'][index % 4]
	}));

	const relocateDepthPreview = [
		{
			title: 'Trusted providers and referrals',
			description:
				'Useful service paths, practical cautions, and context that loses value when reduced to a generic public list.'
		},
		{
			title: 'Neighborhood and soft-landing intelligence',
			description:
				'The lived differences between places, routines, frictions, and what actually helps the first weeks settle.'
		},
		{
			title: 'Family-specific relocation support',
			description:
				'More nuanced guidance for parents, school questions, support systems, and the realities that surface after the move begins.'
		},
		{
			title: 'Advanced checklists and decision support',
			description:
				'The kind of deeper sequencing that belongs inside Community once someone is beyond the first orientation phase.'
		}
	];
</script>

<div class="relocate-page">
	<Hero
		variant="page"
		subtitle="Relocate"
		description="Use this page to get clearer on what moving to Ghana may actually ask of your life, and to slow the decision down before excitement or urgency takes over."
		{...APPROACH_MEDIA}
	>
		{#snippet title()}
			<h1>Relocation guidance for people trying to move with more clarity and fewer mistakes.</h1>
		{/snippet}

		{#snippet aside()}
			<div class="hero-panel">
				<p class="panel-kicker">Use This Page To</p>
				<ul>
					<li>Clarify the difference between visiting and living</li>
					<li>Work through the early relocation questions more carefully</li>
					<li>See where deeper support may help once the move gets real</li>
				</ul>
			</div>
		{/snippet}
	</Hero>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Public Layer"
				title="What stays free on Relocate"
				description="This page should help people ask better questions and make fewer fantasy-driven decisions. It should not try to become the full relocation vault."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={publicRelocateCards} />
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell narrow-shell">
			<LeadCaptureInline
				title="Still deciding whether Ghana is a visit, a trial stay, or a real move?"
				description={`Start with the free guide: ${DEFAULT_LEAD_MAGNET_NAME}`}
				buttonText="Get the Free Guide"
				source="relocate_page"
				leadMagnet={DEFAULT_LEAD_MAGNET_NAME}
				entryPage="/relocate"
			/>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Orientation Sequence"
				title="Relocation should move in stages, not in one emotional wave."
				description="These are the decisions that belong in public because they help people slow down, name the real questions, and move toward Ghana more carefully."
			/>

			<ol class="step-grid" aria-label="Relocation orientation sequence">
				{#each relocateSteps as step, index}
					<li class={`step-card step-${index + 1}`}>
						<span class="step-number">{step.step}</span>
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<LockedPreview
				eyebrow="What Moves Into Community"
				title="The highest-value relocation help should feel current, trusted, and relational."
				description="That is why Relocate stays public as an orientation layer while the deeper member layer holds the more time-sensitive, nuanced, and support-heavy pieces."
				items={relocateDepthPreview}
				ctaHref="/community"
				ctaLabel="Explore Community"
			/>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Common Questions"
				title="Selected public answers"
				description="Keep the basics accessible, but let the deeper pathways live elsewhere."
			/>

			<div class="faq-grid">
				{#each relocateFaq as item}
					<details class="faq-card">
						<summary>{item.question}</summary>
						<p>{item.answer}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<StrategicCta
				eyebrow="Next Step"
				title="Get oriented for free. Get serious inside Community."
				description="That is the role of the platform now. Public pages reduce confusion. Community carries the deeper, more current, more relational layer."
				primaryHref="/community"
				primaryLabel="See Community"
				secondaryHref="/start-here"
				secondaryLabel="Start Here"
			/>
		</div>
	</section>
</div>

<style>
	.relocate-page {
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

	.step-grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
		margin: 2rem 0 0;
		padding: 0;
	}

	.step-card {
		display: grid;
		gap: 0.9rem;
		min-height: 16rem;
		padding: 1.35rem;
		border-radius: 1.6rem;
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.1);
	}

	.step-1 {
		background: linear-gradient(180deg, #d9042b 0%, #b10323 100%);
		color: white;
	}

	.step-2 {
		background: linear-gradient(180deg, #f2b705 0%, #dfa200 100%);
		color: #111111;
	}

	.step-3 {
		background: linear-gradient(180deg, #038c25 0%, #026b1d 100%);
		color: white;
	}

	.step-4 {
		background: linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		color: white;
	}

	.step-number {
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

	.step-2 .step-number {
		background: rgba(17, 17, 17, 0.1);
	}

	.step-card h3,
	.faq-card summary {
		margin: 0;
		font-size: 1.28rem;
		line-height: 1.05;
		letter-spacing: -0.03em;
	}

	.step-card p,
	.faq-card p {
		margin: 0;
		font-size: 0.96rem;
		line-height: 1.72;
		opacity: 0.86;
	}

	.faq-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 2rem;
	}

	.faq-card {
		padding: 1.25rem;
		border-radius: 1.5rem;
		background: linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
	}

	.faq-card summary {
		cursor: pointer;
		list-style: none;
	}

	.faq-card summary::-webkit-details-marker {
		display: none;
	}

	.faq-card p {
		margin-top: 0.9rem;
		color: rgba(17, 17, 17, 0.78);
	}

	@media (max-width: 960px) {
		.page-shell {
			padding-inline: 1rem;
		}

		.hero-grid,
		.step-grid,
		.faq-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
