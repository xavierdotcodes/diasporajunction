<script>
	import { onMount } from 'svelte';
	import AccessCardGrid from '$lib/components/shared/AccessCardGrid.svelte';
	import CTASection from '$lib/components/home/Cta.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import Logo from '$lib/components/shared/Logo.svelte';
	import PillarCard from '$lib/components/home/Pillar.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('home.page');

	const ecosystemLayers = [
		{
			eyebrow: 'Clarity Before Commitment',
			title: 'Start with the questions that matter most',
			description:
				'Read practical articles that help you slow down, compare your options, and understand the difference between a visit, a trial season, and a real move.',
			surface: 'red'
		},
		{
			eyebrow: 'Connection & Belonging',
			title: 'Find your footing with more trust',
			description:
				'Some questions are easier to answer when you can feel the people, rhythm, and lived texture behind the move instead of relying on guesswork alone.',
			surface: 'gold'
		},
		{
			eyebrow: 'Life Beyond Arrival',
			title: 'Think past the first landing',
			description:
				'If Ghana starts to feel like a serious next chapter, DiasporaJunxion helps you think more clearly about family life, belonging, work, and what it takes to build something steady.',
			surface: 'green'
		}
	];

	const pillars = [
		{
			title: 'Relocation',
			description:
				'We help diaspora travelers, returners, and families think more clearly about moving to Ghana with grounded context instead of guesswork.',
			icon: '01',
			accent: 'gold',
			imagePosition: '50% 56%',
			contentOverlap: '7.25rem',
			contentLift: '2.9rem',
			image: '/images/landing/connection.webp'
		},
		{
			title: 'Guidance',
			description:
				'From cost of living to family rhythms to the difference between visiting and living, we create practical guidance for real-life decisions.',
			icon: '02',
			accent: 'green',
			imagePosition: '52% 44%',
			contentOverlap: '7.75rem',
			contentLift: '1.6rem',
			image: '/images/landing/innovation.webp'
		},
		{
			title: 'Culture',
			description:
				'To know Ghana, you need more than logistics. You need rhythm, places, people, food, nightlife, and the living texture of the culture.',
			icon: '03',
			accent: 'red',
			imagePosition: '50% 42%',
			contentOverlap: '6.85rem',
			contentLift: '3.25rem',
			image: '/images/landing/culture.webp'
		},
		{
			title: 'Community',
			description:
				'DiasporaJunxion is about more than information. It is about belonging, trusted pathways, and feeling less alone in the move.',
			icon: '04',
			accent: 'green',
			imagePosition: '46% 46%',
			contentOverlap: '7.1rem',
			contentLift: '2rem',
			image: '/images/landing/collaboration.webp'
		},
		{
			title: 'Opportunity',
			description:
				'Beyond relocation, we hold space for long-term participation through investment intrigue, local connection, and the bridge into African possibility.',
			icon: '05',
			accent: 'gold',
			imagePosition: '54% 48%',
			contentOverlap: '7.9rem',
			contentLift: '2.7rem',
			image: '/images/landing/impact1.webp'
		}
	];

	const approachSteps = [
		{
			step: '01',
			title: 'Orient',
			accent: 'red',
			description:
				'Start with reality. We help you understand the emotional, practical, and cultural terrain before momentum starts pretending to be clarity.'
		},
		{
			step: '02',
			title: 'Connect',
			accent: 'gold',
			description:
				'Then come closer to the people, context, and social rhythm that make Ghana feel lived, not just imagined from afar.'
		},
		{
			step: '03',
			title: 'Build',
			accent: 'green',
			description:
				'For those thinking longer term, we open the frame toward participation, contribution, and the kind of grounded next chapter that can actually hold.'
		}
	];

	const platformOverviewCards = [
		{
			eyebrow: 'Best First Step',
			title: 'Start Here',
			description:
				'Use this if you are still figuring out whether Ghana is a curiosity, a possible move, or something more serious.',
			href: '/start-here',
			cta: 'Start Here',
			access: 'First read',
			accent: 'red'
		},
		{
			eyebrow: 'Free Guide',
			title: 'Checklist',
			description:
				'Get the free Ghana reality guide if you want a calmer way to think through the move before emotions start running ahead of clarity.',
			href: '/checklist',
			cta: 'Get The Guide',
			access: 'Free',
			accent: 'gold'
		},
		{
			eyebrow: 'Reality Check',
			title: 'Visiting vs Living',
			description:
				'Start here if you need help separating the energy of a trip from the reality of building a life in Ghana.',
			href: '/blog/visiting-vs-living-in-ghana',
			cta: 'Read The Article',
			access: 'Popular',
			accent: 'green'
		},
		{
			eyebrow: 'Practical Next Step',
			title: 'Relocate',
			description:
				'Go here when Ghana is starting to feel real and you need more practical guidance around the move itself.',
			href: '/relocate',
			cta: 'Explore Relocate',
			access: 'Free',
			accent: 'dark',
			locked: false
		}
	];

	let activePillarIndex = $state(0);
	let pillarsPaused = $state(false);
	let pillarDirection = $state(1);
	const pillarRotationMs = 5200;
	let outgoingPillarIndex = $state(null);
	let outgoingPillarPhase = $state('idle');
	let pillarPhase = $state('active');
	let pillarTransitionTimer;
	const activePillar = $derived(pillars[activePillarIndex]);

	function advancePillar(step = 1) {
		if (pillars.length < 2) return;

		pillarDirection = step >= 0 ? 1 : -1;
		outgoingPillarIndex = activePillarIndex;
		outgoingPillarPhase = 'enter';
		activePillarIndex = (activePillarIndex + step + pillars.length) % pillars.length;
		pillarPhase = 'enter-pre';

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				outgoingPillarPhase = 'exit';
				pillarPhase = 'active';
			});
		});

		clearTimeout(pillarTransitionTimer);
		pillarTransitionTimer = window.setTimeout(() => {
			outgoingPillarIndex = null;
			outgoingPillarPhase = 'idle';
		}, 860);
	}

	onMount(() => {
		const interval = window.setInterval(() => {
			if (pillarsPaused) return;
			advancePillar(1);
		}, pillarRotationMs);

		return () => {
			window.clearInterval(interval);
			clearTimeout(pillarTransitionTimer);
		};
	});
</script>

<svelte:head>
	<link
		rel="preload"
		as="image"
		href="/videos/covers/desktop_landing-hero-cover.jpg"
		media="(min-width: 769px)"
	/>
	<link
		rel="preload"
		as="image"
		href="/videos/covers/mobile_landing-hero-cover.jpg"
		media="(max-width: 768px)"
	/>
	{#each pillars as pillar}
		<link rel="preload" as="image" href={pillar.image} />
	{/each}
</svelte:head>

<div class="landing-page">
	<Hero
		variant="brand"
		subtitle="Grounded guidance for diaspora people thinking seriously about Ghana"
		description={`If Ghana has been on your mind, DiasporaJunxion helps you get clearer about what comes next.<br /><br />
		Start here if you are comparing a visit with a move, thinking about Ghana with children, or trying to understand whether life in Ghana could actually fit you.<br /><br />
		<span class="brand-gold">Less hype. More context. Better next steps.</span>`}
		desktopVideoSrc="/videos/desktop_landing-hero.mp4"
		desktopPosterSrc="/videos/covers/desktop_landing-hero-cover.jpg"
		mobileVideoSrc="/videos/mobile_landing-hero.mp4"
		mobilePosterSrc="/videos/covers/mobile_landing-hero-cover.jpg"
	>
		{#snippet logo()}
			<Logo src="/images/logos/diasporajunxion-icon.png" width="160" alt="DiasporaJunxion emblem" />
		{/snippet}

		{#snippet title()}
			<h1>
				<span class="hero-word hero-word-dark">Diaspora</span>
				<span class="hero-word hero-word-gold">Junxion</span>
			</h1>
		{/snippet}

		{#snippet cta()}
			<div class="hero-actions">
				<a href="/start-here" class="hero-primary-link">Start Here</a>
				<a href="/blog/visiting-vs-living-in-ghana" class="hero-secondary-link">Read Visiting vs Living</a>
			</div>
		{/snippet}
	</Hero>

	<main class="landing-story">
		<section class="story-section section-dark section-quickstart">
			<div class="section-shell">
				<SectionHeader
					eyebrow="Where To Begin"
					title="Choose the next step that matches where you are."
					description="You do not need to read everything. Start with the path that sounds most like your current question."
					tone="dark"
				/>

				<div class="section-spacer"></div>
				<AccessCardGrid items={platformOverviewCards} tone="dark" columns={4} />
			</div>
		</section>

		<section id="about" class="story-section section-cream">
			<div class="section-shell about-shell">
				<div class="section-label section-label-dark">How DiasporaJunxion Helps</div>

				<div class="about-grid">
					<div class="about-lead">
						<h2>A clearer way to explore life in Ghana before you make a bigger move.</h2>
					</div>

					<div class="about-copy">
						<p>
							Whether you are still exploring, planning a visit, or weighing a real relocation,
							DiasporaJunxion helps you sort through the questions with more clarity and less noise.
						</p>
						<p>
							The goal is simple: help you avoid fantasy, reduce expensive mistakes, and move
							toward Ghana in a way that feels grounded, informed, and more human.
						</p>
					</div>
				</div>

				<div class="about-divider">
					<p>What you usually need first</p>
				</div>

				<div class="ecosystem-grid">
					{#each ecosystemLayers as layer}
						<article class={`ecosystem-card ${layer.surface}`}>
							<p class="ecosystem-eyebrow">{layer.eyebrow}</p>
							<h3>{layer.title}</h3>
							<p>{layer.description}</p>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<section id="pillars" class="story-section section-dark">
			<div class="section-shell pillars-shell">
				<div class="pillars-header">
					<div class="section-label">What We Focus On</div>
					<h2>The things that usually matter most once Ghana starts to feel real.</h2>
				</div>
				<p class="pillars-intro">
					People rarely need just one answer. They need better context, steadier support, and a
					clearer way to move from curiosity into real-life decisions.
				</p>
			</div>

			<div
				class="pillars-carousel"
				data-no-reveal
				role="region"
				aria-label="Core pillars carousel"
				onmouseenter={() => (pillarsPaused = true)}
				onmouseleave={() => (pillarsPaused = false)}
				onfocusin={() => (pillarsPaused = true)}
				onfocusout={() => (pillarsPaused = false)}
			>
				<div class="pillars-toolbar">
					<div class="pillars-counter">
						<span>{String(activePillarIndex + 1).padStart(2, '0')}</span>
						<div class="pillars-counter-copy">
							<p>{activePillar.title}</p>
							<small>Auto-rotating through the core pillars</small>
						</div>
					</div>
				</div>

				<div class="pillars-progress" aria-hidden="true">
					{#key `${activePillarIndex}-${pillarsPaused}`}
						<span
							class:paused={pillarsPaused}
							style={`animation-duration: ${pillarRotationMs}ms;`}
						></span>
					{/key}
				</div>

				<div class="pillars-stage" aria-live="polite">
					{#if outgoingPillarIndex !== null}
						<div
							class={`pillars-slide pillars-slide-outgoing ${outgoingPillarPhase} ${pillarDirection > 0 ? 'forward' : 'backward'}`}
							aria-hidden="true"
						>
							<PillarCard {...pillars[outgoingPillarIndex]} reverse={outgoingPillarIndex % 2 !== 0} />
						</div>
					{/if}

					<div
						class={`pillars-slide pillars-slide-current ${pillarPhase} ${pillarDirection > 0 ? 'forward' : 'backward'}`}
					>
						<PillarCard {...activePillar} reverse={activePillarIndex % 2 !== 0} />
					</div>
				</div>
			</div>
		</section>

		<section class="bridge-section" aria-label="Editorial transition">
			<div class="bridge-shell">
				<p class="bridge-kicker">The questions change as the move gets closer.</p>
				<p class="bridge-copy">
					Not just whether Ghana feels good, but whether your life, family, and plans can actually
					hold here.
				</p>
			</div>
		</section>

		<section id="approach" class="story-section section-cream section-approach">
			<div class="section-shell">
				<div class="approach-header">
					<div class="section-label section-label-dark">How To Move Through It</div>
					<h2>Orient. Connect. Build.</h2>
					<p>
						First get clear on what Ghana is really asking of you. Then come closer to the people,
						rhythm, and practical realities. Then decide what kind of life you actually want to
						build.
					</p>
				</div>

				<ol class="approach-track" aria-label="DiasporaJunxion approach">
					{#each approachSteps as item}
						<li class={`approach-step ${item.accent}`}>
							<div class="approach-step-head">
								<span class="approach-step-number">{item.step}</span>
								<h3>{item.title}</h3>
							</div>
							<p>{item.description}</p>
						</li>
					{/each}
				</ol>
			</div>
		</section>

		<section id="story" class="story-section section-green">
			<div class="section-shell reason-shell">
				<div class="section-label">Why This Exists</div>

				<div class="reason-panel">
					<div class="reason-lead">
						<h2>Because the pull toward Ghana deserves more than guesswork.</h2>
					</div>

					<div class="reason-copy">
						<p>
							More people in the diaspora are thinking about Ghana not only as a place to visit,
							but as a place to reconnect, relocate, raise children, work, or start over.
						</p>
						<p>
							That can be hopeful, exciting, and deeply meaningful. It can also get confusing fast
							when the only information available is hype, scattered opinions, or social media
							fantasy.
						</p>
						<p>
							DiasporaJunxion exists to give people a steadier way to think, read, and move so the
							next step feels clearer and more trustworthy.
						</p>
					</div>
				</div>
			</div>
		</section>

		<CTASection />
	</main>
</div>

<style>
	.landing-page {
		background: #f8f2df;
		color: #111111;
		overflow-x: clip;
	}

	.landing-story {
		position: relative;
	}

	.bridge-kicker {
		margin: 0 0 0.65rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.story-section {
		position: relative;
		padding: clamp(5rem, 8vw, 7.5rem) 1.5rem;
	}

	.section-spacer {
		height: 2rem;
	}

	.section-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
	}

	.section-label {
		margin: 0 0 1.15rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.86);
	}

	.section-label-dark {
		color: rgba(17, 17, 17, 0.72);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.85rem;
	}

	.hero-primary-link,
	.hero-secondary-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3.45rem;
		padding: 0 1.55rem;
		border-radius: 999px;
		font-size: 0.97rem;
		font-weight: 700;
		text-decoration: none;
		transition:
			transform 180ms ease,
			box-shadow 180ms ease,
			background-color 180ms ease,
			border-color 180ms ease;
	}

	.hero-primary-link {
		background: linear-gradient(135deg, #038c25, #026b1d);
		color: white;
		box-shadow: 0 20px 40px rgba(3, 140, 37, 0.22);
	}

	.hero-primary-link:hover {
		transform: translateY(-1px);
	}

	.hero-secondary-link {
		background: rgba(17, 17, 17, 0.05);
		border: 1px solid rgba(17, 17, 17, 0.14);
		color: #111111;
	}

	.hero-secondary-link:hover {
		background: rgba(17, 17, 17, 0.1);
	}

	.section-cream {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.22), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.about-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: end;
	}

	.about-lead h2,
	.pillars-header h2,
	.approach-header h2,
	.reason-lead h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.45rem, 5vw, 4.7rem);
		line-height: 0.94;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}

	.about-lead h2 {
		color: #111111;
	}

	.about-copy {
		display: grid;
		gap: 1.2rem;
		max-width: 37rem;
	}

	.about-copy p,
	.pillars-intro,
	.approach-header p,
	.reason-copy p {
		margin: 0;
		font-size: clamp(1rem, 1.32vw, 1.18rem);
		line-height: 1.78;
	}

	.about-copy p {
		color: rgba(17, 17, 17, 0.78);
	}

	.about-divider {
		margin: clamp(2rem, 5vw, 4rem) 0 1.65rem;
		max-width: 22rem;
		padding-top: 1.1rem;
		border-top: 2px solid rgba(17, 17, 17, 0.16);
	}

	.about-divider p {
		margin: 0;
		font-size: 0.92rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.62);
	}

	.ecosystem-grid {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 1.25rem;
		align-items: stretch;
	}

	.ecosystem-card {
		position: relative;
		min-height: 18rem;
		padding: 1.75rem;
		border-radius: 2rem;
		box-shadow: 0 24px 50px rgba(0, 0, 0, 0.12);
	}

	.ecosystem-card:nth-child(1) {
		grid-column: span 4;
	}

	.ecosystem-card:nth-child(2) {
		grid-column: span 4;
		transform: translateY(1.2rem);
	}

	.ecosystem-card:nth-child(3) {
		grid-column: span 4;
	}

	.ecosystem-card.obsidian {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 55%),
			linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		color: white;
	}

	.ecosystem-card.red {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 55%),
			linear-gradient(180deg, #d9042b 0%, #b10323 100%);
		color: white;
	}

	.ecosystem-card.gold {
		background:
			radial-gradient(circle at top right, rgba(255, 255, 255, 0.24), transparent 52%),
			linear-gradient(180deg, #f2b705 0%, #e4a900 100%);
		color: #111111;
	}

	.ecosystem-card.green {
		background:
			radial-gradient(circle at top right, rgba(255, 255, 255, 0.2), transparent 56%),
			linear-gradient(180deg, #038c25 0%, #026b1d 100%);
		color: white;
	}

	.ecosystem-eyebrow {
		margin: 0 0 0.95rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}

	.ecosystem-card.obsidian .ecosystem-eyebrow,
	.ecosystem-card.red .ecosystem-eyebrow,
	.ecosystem-card.green .ecosystem-eyebrow {
		color: rgba(255, 255, 255, 0.68);
	}

	.ecosystem-card.gold .ecosystem-eyebrow {
		color: rgba(17, 17, 17, 0.62);
	}

	.ecosystem-card h3 {
		margin: 0 0 0.95rem;
		font-size: clamp(1.55rem, 2vw, 2.2rem);
		line-height: 1.03;
		letter-spacing: -0.04em;
		text-wrap: balance;
	}

	.ecosystem-card p:last-child {
		margin: 0;
		font-size: 1rem;
		line-height: 1.7;
		max-width: 30rem;
	}

	.ecosystem-card.obsidian p:last-child,
	.ecosystem-card.red p:last-child,
	.ecosystem-card.green p:last-child {
		color: rgba(255, 255, 255, 0.84);
	}

	.ecosystem-card.gold p:last-child {
		color: rgba(17, 17, 17, 0.78);
	}

	.section-dark {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.16), transparent 24rem),
			radial-gradient(circle at bottom right, rgba(217, 4, 43, 0.14), transparent 26rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.pillars-shell {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
		gap: clamp(1.75rem, 4vw, 4rem);
		align-items: end;
		margin-bottom: clamp(2.5rem, 4vw, 4rem);
	}

	.pillars-header h2 {
		color: #fff8ef;
	}

	.pillars-intro {
		max-width: 34rem;
		color: rgba(255, 248, 239, 0.78);
	}

	.pillars-carousel {
		display: grid;
		gap: 1rem;
		width: min(100%, 88rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.pillars-toolbar {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.pillars-counter {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.pillars-counter-copy {
		display: grid;
		gap: 0.2rem;
	}

	.pillars-counter span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		background: rgba(242, 183, 5, 0.12);
		font-family: var(--font-mono);
		font-size: 0.84rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		color: #f2b705;
	}

	.pillars-counter p {
		margin: 0;
		font-size: 1.02rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: rgba(255, 248, 239, 0.88);
	}

	.pillars-counter small {
		font-size: 0.78rem;
		line-height: 1.4;
		letter-spacing: 0.01em;
		color: rgba(255, 248, 239, 0.54);
	}

	.pillars-progress {
		position: relative;
		height: 0.4rem;
		border-radius: 999px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.08);
	}

	.pillars-progress span {
		display: block;
		height: 100%;
		width: 100%;
		transform-origin: left center;
		background: linear-gradient(90deg, #f2b705 0%, #fff3c1 45%, #d9042b 100%);
		animation: pillarProgress linear forwards;
	}

	.pillars-progress span.paused {
		animation-play-state: paused;
	}

	.pillars-stage {
		position: relative;
		min-height: clamp(26rem, 46vw, 40rem);
		isolation: isolate;
	}

	.pillars-slide {
		will-change: transform, opacity, filter;
		transition:
			transform 820ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 820ms cubic-bezier(0.22, 1, 0.36, 1),
			filter 820ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.pillars-slide-current {
		position: relative;
		will-change: transform, opacity;
	}

	.pillars-slide-current.enter-pre.forward {
		transform: translate3d(6.5%, 1.1rem, 0) scale(0.985);
		opacity: 0;
		filter: blur(14px);
	}

	.pillars-slide-current.enter-pre.backward {
		transform: translate3d(-6.5%, 1.1rem, 0) scale(0.985);
		opacity: 0;
		filter: blur(14px);
	}

	.pillars-slide-current.active {
		transform: translate3d(0, 0, 0) scale(1);
		opacity: 1;
		filter: blur(0);
	}

	.pillars-slide-outgoing {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.pillars-slide-outgoing.enter {
		transform: translate3d(0, 0, 0) scale(1);
		opacity: 1;
		filter: blur(0);
	}

	.pillars-slide-outgoing.exit {
		opacity: 0;
		filter: blur(10px);
	}

	.pillars-slide-outgoing.exit.forward {
		transform: translate3d(-4.5%, 0.4rem, 0) scale(0.992);
	}

	.pillars-slide-outgoing.exit.backward {
		transform: translate3d(4.5%, 0.4rem, 0) scale(0.992);
	}

	.bridge-section {
		padding: 2.25rem 1.5rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 24rem),
			linear-gradient(180deg, #111111 0%, #1c1c1c 100%);
		color: white;
	}

	.bridge-shell {
		display: grid;
		grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
		gap: 1.5rem;
		align-items: center;
		width: min(100%, 78rem);
		margin: 0 auto;
	}

	.bridge-kicker {
		color: rgba(242, 183, 5, 0.9);
	}

	.bridge-copy {
		margin: 0;
		font-size: clamp(1.2rem, 2vw, 1.85rem);
		font-weight: 600;
		line-height: 1.35;
		letter-spacing: -0.03em;
		color: rgba(255, 248, 239, 0.9);
		text-wrap: balance;
	}

	.approach-header {
		max-width: 48rem;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}

	.approach-header h2 {
		color: #111111;
	}

	.approach-header p {
		color: rgba(17, 17, 17, 0.78);
	}

	.section-approach {
		background:
			radial-gradient(circle at top right, rgba(217, 4, 43, 0.1), transparent 24rem),
			radial-gradient(circle at bottom left, rgba(3, 140, 37, 0.08), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.approach-track {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 1.25rem;
		padding: 0;
		margin: 0;
	}

	.approach-step {
		grid-column: span 4;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 18rem;
		padding: 1.7rem;
		border-radius: 2rem;
		box-shadow:
			0 24px 50px rgba(17, 17, 17, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.approach-step.red {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 54%),
			linear-gradient(180deg, #d9042b 0%, #b10323 100%);
		color: white;
	}

	.approach-step.gold {
		background:
			radial-gradient(circle at top right, rgba(255, 255, 255, 0.2), transparent 54%),
			linear-gradient(180deg, #f2b705 0%, #dfa200 100%);
		color: #111111;
		box-shadow:
			0 24px 50px rgba(187, 136, 0, 0.16),
			inset 0 1px 0 rgba(255, 255, 255, 0.28);
	}

	.approach-step.green {
		background:
			radial-gradient(circle at top right, rgba(255, 255, 255, 0.16), transparent 54%),
			linear-gradient(180deg, #038c25 0%, #026b1d 100%);
		color: white;
		box-shadow:
			0 24px 50px rgba(2, 107, 29, 0.16),
			inset 0 1px 0 rgba(255, 255, 255, 0.22);
	}

	.approach-step:nth-child(2) {
		transform: translateY(2rem);
	}

	.approach-step:nth-child(3) {
		transform: translateY(4rem);
	}

	.approach-step-head {
		display: grid;
		gap: 1rem;
	}

	.approach-step-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.84rem;
		font-weight: 700;
		letter-spacing: 0.18em;
	}

	.approach-step.red .approach-step-number,
	.approach-step.green .approach-step-number {
		background: rgba(255, 255, 255, 0.14);
		color: #fff8ef;
	}

	.approach-step.gold .approach-step-number {
		background: rgba(17, 17, 17, 0.1);
		color: #111111;
	}

	.approach-step h3 {
		margin: 0;
		font-size: clamp(1.55rem, 1.9vw, 2.15rem);
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.approach-step.red h3,
	.approach-step.green h3 {
		color: white;
	}

	.approach-step.gold h3 {
		color: #111111;
	}

	.approach-step p {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.75;
	}

	.approach-step.red p,
	.approach-step.green p {
		color: rgba(255, 255, 255, 0.82);
	}

	.approach-step.gold p {
		color: rgba(17, 17, 17, 0.78);
	}

	.section-green {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.22), transparent 24rem),
			linear-gradient(180deg, #038c25 0%, #026b1d 100%);
		color: #111111;
	}

	.reason-panel {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
		gap: clamp(1.75rem, 4vw, 4rem);
		padding: clamp(2rem, 5vw, 3rem);
		border-radius: 2.1rem;
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 55%),
			linear-gradient(180deg, #fff8ef 0%, #f6eddb 100%);
		box-shadow: 0 30px 60px rgba(2, 107, 29, 0.22);
	}

	.reason-lead h2 {
		color: #111111;
	}

	.reason-copy {
		display: grid;
		gap: 1.15rem;
		max-width: 36rem;
	}

	.reason-copy p {
		color: rgba(17, 17, 17, 0.82);
	}

	@keyframes pillarProgress {
		from {
			transform: scaleX(0);
		}

		to {
			transform: scaleX(1);
		}
	}

	@media (max-width: 1024px) {
		.about-grid,
		.pillars-shell,
		.reason-panel,
		.bridge-shell {
			grid-template-columns: 1fr;
		}

		.ecosystem-card:nth-child(1),
		.ecosystem-card:nth-child(2),
		.ecosystem-card:nth-child(3) {
			grid-column: span 12;
			transform: none;
		}

		.approach-step {
			grid-column: span 12;
			min-height: auto;
		}

		.approach-step:nth-child(2),
		.approach-step:nth-child(3) {
			transform: none;
		}
	}

	@media (max-width: 768px) {
		.story-section {
			padding-inline: 1rem;
		}

		.about-copy p,
		.pillars-intro,
		.approach-header p,
		.reason-copy p,
		.ecosystem-card p:last-child,
		.approach-step p {
			font-size: 0.98rem;
			line-height: 1.72;
		}

		.ecosystem-card,
		.approach-step,
		.reason-panel {
			border-radius: 1.5rem;
		}

		.hero-actions {
			width: 100%;
			flex-direction: column;
		}

		.hero-primary-link,
		.hero-secondary-link {
			width: 100%;
		}

		.pillars-carousel {
			padding-inline: 1rem;
		}

		.pillars-toolbar {
			align-items: flex-start;
		}

		.pillars-counter {
			align-items: flex-start;
		}

		.pillars-counter span {
			width: 2.65rem;
			height: 2.65rem;
		}

		.pillars-counter p {
			font-size: 0.96rem;
		}

		.pillars-counter small {
			font-size: 0.72rem;
		}

		.pillars-stage {
			min-height: auto;
		}
	}
</style>
