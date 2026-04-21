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
	import {
		featuredResource,
		startHerePaths,
		startHereQuestions,
		startHereTruths
	} from '$lib/components/start/data.js';

	fileLogger('free.start.page');

	const truthCards = startHereTruths.map((item, index) => ({
		title: item.title,
		description: item.description,
		access: 'Free',
		accent: ['red', 'gold', 'green'][index % 3]
	}));

	const pathCards = startHerePaths.map((item, index) => ({
		title: item.title,
		description: item.description,
		href: item.href,
		cta: item.cta,
		access: 'Free',
		accent: ['dark', 'red', 'green'][index % 3]
	}));
</script>

<svelte:head>
	<title>Start Here | DiasporaJunxion</title>
	<meta
		name="description"
		content="Use Start Here to figure out whether you are exploring, planning a move, thinking about Ghana with children, or trying to find the clearest next step."
	/>
</svelte:head>

<div class="start-page">
	<Hero
		variant="page"
		subtitle="Start Here"
		description="If Ghana has been on your mind but you are not sure what to read, what to do, or how serious this really is yet, this page will help you choose the right next step."
		{...APPROACH_MEDIA}
	>
		{#snippet title()}
			<h1>Not sure where to begin? Start here.</h1>
		{/snippet}

		{#snippet aside()}
			<div class="hero-panel">
				<p class="panel-kicker">Use This Page If</p>
				<ul>
					<li>You are still figuring out whether Ghana is a visit, a trial season, or a real move</li>
					<li>You want help choosing between the blog, relocation guidance, and the next practical step</li>
					<li>You want clarity without pressure or hype</li>
				</ul>
			</div>
		{/snippet}
	</Hero>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Choose Your Path"
				title="Start with the lane that sounds most like your life right now."
				description="You do not need to read the whole site. Pick the path that matches your question and move from there."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={pathCards} />
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Before You Decide"
				title="A few things are worth getting honest about first."
				description="Before you book flights, make promises to yourself, or build a whole future in your head, slow down and name the question clearly."
				tone="dark"
			/>

			<ol class="question-grid" aria-label="Start-here questions">
				{#each startHereQuestions as item}
					<li class="question-card">
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
				eyebrow="Keep Yourself Grounded"
				title="The first right move is not speed. It is clarity."
				description="These reminders can help you stay honest about what you want, what your life can hold, and what deserves more research before you act."
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={truthCards} />
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell narrow-shell">
			<LeadCaptureInline
				title="Want a practical starting point in your inbox?"
				description={`Get the free guide: ${DEFAULT_LEAD_MAGNET_NAME}`}
				buttonText="Send Me The Guide"
				source="start_here_page"
				leadMagnet={DEFAULT_LEAD_MAGNET_NAME}
				entryPage="/start-here"
			/>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<LockedPreview
				eyebrow="When You Need More Than Articles"
				title="Some questions make more sense with better support, not just more reading."
				description="The public site helps you get your bearings. Community is where things get more current, more practical, and more useful once the decision starts feeling real."
				items={[
					{
						title: 'Current pulse',
						description:
							'What is happening now in Ghana, not just what tends to stay true in an evergreen article.'
					},
					{
						title: 'Trusted access',
						description:
							'More curated pathways to people, resources, and next steps you may actually need.'
					},
					{
						title: 'Lived intelligence',
						description:
							'More honest stories, lessons, and realities from people navigating the move.'
					},
					{
						title: 'Decision tools',
						description:
							'Deeper support for people who are past curiosity and getting closer to action.'
					}
				]}
				ctaHref="/community"
				ctaLabel="See What Community Includes"
			/>
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell split-grid">
			<div>
				<SectionHeader
					eyebrow="A Good Next Read"
					title={featuredResource.title}
					description={featuredResource.description}
					tone="dark"
				/>
			</div>
			<div>
				<StrategicCta
					eyebrow="Next Step"
					title="Get clear here, then move to the page that answers your next question."
					description="If you still feel unsure, start with the free guide. If you are ready to go deeper, move into relocation guidance, the blog, or Community."
					primaryHref={featuredResource.href}
					primaryLabel="View The Ebook"
					secondaryHref="/checklist"
					secondaryLabel="Get The Free Guide"
				/>
			</div>
		</div>
	</section>
</div>

<style>
	.start-page {
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

	.split-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.72fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: end;
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

	.question-grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		margin: 2rem 0 0;
		padding: 0;
	}

	.question-card {
		display: grid;
		gap: 0.9rem;
		padding: 1.35rem;
		border-radius: 1.6rem;
		background: linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		box-shadow: 0 20px 46px rgba(0, 0, 0, 0.16);
	}

	.question-card span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		background: rgba(242, 183, 5, 0.14);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		color: #f2b705;
	}

	.question-card h3 {
		margin: 0;
		font-size: 1.28rem;
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: white;
	}

	.question-card p {
		margin: 0;
		font-size: 0.96rem;
		line-height: 1.72;
		color: rgba(255, 248, 239, 0.76);
	}

	@media (max-width: 960px) {
		.page-shell {
			padding-inline: 1rem;
		}

		.split-grid,
		.question-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
