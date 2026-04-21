<script>
	import LeadCaptureInline from '$lib/components/lead/LeadCaptureInline.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('free.checklist.page');
</script>

<svelte:head>
	<title>Free Ghana Checklist | DiasporaJunxion</title>
	<meta
		name="description"
		content="Get the free Ghana reality guide and use it as your first practical checklist for thinking through a visit, relocation, or deeper move."
	/>
</svelte:head>

<div class="checklist-page">
	<section class="checklist-hero">
		<div class="page-shell hero-grid">
			<div class="hero-copy">
				<p class="eyebrow">Free Checklist</p>
				<h1>Get a calmer starting point before you make a bigger move.</h1>
				<p>
					If Ghana has been on your mind, this is a good place to slow down and get practical. We
					will send you <strong>{DEFAULT_LEAD_MAGNET_NAME}</strong> so you can think through the
					move with more clarity and fewer blind spots.
				</p>
			</div>

			<div class="hero-panel">
				<p class="panel-kicker">What it helps you do</p>
				<ul>
					<li>Compare visiting and living more honestly</li>
					<li>Spot questions you should answer before relocating</li>
					<li>Take a clearer next step without hype or overwhelm</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell narrow-shell">
			<LeadCaptureInline
				title="Send me the free Ghana reality guide"
				description="A simple first step for people exploring a visit, a move, or a deeper life in Ghana."
				buttonText="Send Me The Guide"
				source="checklist_page"
				leadMagnet={DEFAULT_LEAD_MAGNET_NAME}
				entryPage="/checklist"
			/>
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<SectionHeader
				eyebrow="After You Read It"
				title="Use it to decide what to do next."
				description="The guide is most useful when it leads somewhere. Use it to figure out whether you should keep reading, start planning, or go deeper into support."
				tone="dark"
			/>

			<div class="next-grid">
				<a href="/start-here" class="next-card">
					<p>Start Here</p>
					<h3>Get the big-picture decision path.</h3>
					<span>Use this if you still need help figuring out where you are in the process.</span>
				</a>
				<a href="/blog/visiting-vs-living-in-ghana" class="next-card">
					<p>Read Next</p>
					<h3>Visiting vs living in Ghana</h3>
					<span>Use this if you are trying to separate excitement from actual day-to-day reality.</span>
				</a>
				<a href="/relocate" class="next-card">
					<p>Relocate</p>
					<h3>Go deeper on the move itself.</h3>
					<span>Use this if Ghana is starting to feel like a real plan, not just an idea.</span>
				</a>
			</div>
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<StrategicCta
				tone="light"
				eyebrow="Need More Than Articles?"
				title="When the question gets more real, Community is the next layer."
				description="Start with the free guide. Step into Community when you want more current insight, trusted resources, and deeper support."
				primaryHref="/community"
				primaryLabel="See Community"
				secondaryHref="/blog"
				secondaryLabel="Read The Blog"
			/>
		</div>
	</section>
</div>

<style>
	.checklist-page {
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
	.checklist-hero {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 24rem),
			radial-gradient(circle at bottom right, rgba(217, 4, 43, 0.12), transparent 26rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
		color: white;
	}

	.checklist-hero {
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

	.next-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 2rem;
	}

	.next-card {
		display: grid;
		gap: 0.8rem;
		padding: 1.35rem;
		border-radius: 1.6rem;
		background: rgba(255, 255, 255, 0.06);
		color: white;
		text-decoration: none;
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.14);
	}

	.next-card p {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.88);
	}

	.next-card h3 {
		margin: 0;
		font-size: 1.35rem;
		line-height: 1.08;
		letter-spacing: -0.04em;
	}

	.next-card span {
		font-size: 0.94rem;
		line-height: 1.68;
		color: rgba(255, 248, 239, 0.8);
	}

	@media (max-width: 960px) {
		.hero-grid,
		.next-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.page-shell {
			padding-inline: 1rem;
		}
	}
</style>
