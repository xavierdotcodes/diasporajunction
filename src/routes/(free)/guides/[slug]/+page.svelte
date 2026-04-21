<script>
	import GuideUpsellBlock from '$lib/components/shared/GuideUpsellBlock.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('free.guides.detail.page');

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.guide.title} | DiasporaJunxion Guides</title>
	<meta name="description" content={data.guide.description} />
</svelte:head>

<article class="guide-page">
	<section class="guide-hero">
		<div class="guide-shell hero-grid">
			<div class="hero-copy">
				<p class="eyebrow">{data.guide.category}</p>
				<h1>{data.guide.title}</h1>
				<p class="guide-lede">{data.guide.lede}</p>
			</div>

			<div class="hero-meta">
				<p class="meta-kicker">Public Guide</p>
				<div class="meta-row">
					<span>Read time</span>
					<strong>{data.guide.readTime}</strong>
				</div>
				<div class="meta-row">
					<span>Layer</span>
					<strong>Free orientation</strong>
				</div>
				<div class="meta-row">
					<span>Next step</span>
					<strong>Community depth when needed</strong>
				</div>
			</div>
		</div>
	</section>

	<section class="guide-body-section">
		<div class="guide-shell body-grid">
			<div class="guide-body">
				{#each data.guide.sections as section, index}
					<section class="guide-section">
						<h2>{section.title}</h2>
						{#each section.paragraphs as paragraph}
							<p>{paragraph}</p>
						{/each}

						{#if index === 0}
							<div class="inline-upsell">
								<GuideUpsellBlock
									eyebrow="When The Question Gets Deeper"
									title="The public guide should orient you. Community should hold the sharper next layer."
									description="That is where more current signals, richer lived experience, trusted access, and more structured decision support belong."
									items={data.guide.communityPreview.slice(0, 2)}
								/>
							</div>
						{/if}
					</section>
				{/each}
			</div>

			<aside class="guide-sidebar">
				<div class="sidebar-card">
					<p class="sidebar-kicker">Why This Is Public</p>
					<p>
						Guides build trust and orientation. They help people understand the terrain without
						trying to expose every high-value layer in public.
					</p>
				</div>

				<div class="sidebar-card">
					<p class="sidebar-kicker">What Deepens In Community</p>
					<ul>
						{#each data.guide.communityPreview as item}
							<li>{item.title}</li>
						{/each}
					</ul>
				</div>
			</aside>
		</div>
	</section>

	<section class="guide-preview-section">
		<div class="guide-shell">
			<GuideUpsellBlock
				eyebrow="Community Preview"
				title="Move from reading into a more current, more relational layer."
				description="Community is where DiasporaJunxion carries the live pulse, trusted pathways, lived intelligence, and more useful next-step support."
				items={data.guide.communityPreview}
			/>
		</div>
	</section>

	<section class="guide-related-section">
		<div class="guide-shell">
			<SectionHeader
				eyebrow="Related Guides"
				title="Keep orienting in public, then deepen when needed."
				description="These reads stay open to help people understand the terrain before they need the member layer."
			/>

			<div class="related-grid">
				{#each data.relatedGuides as item}
					<a href={item.href} class="related-card">
						<p class="related-category">{item.category}</p>
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="guide-cta-section">
		<div class="guide-shell">
			<StrategicCta
				tone="light"
				eyebrow="Next Step"
				title="Use the public guide to get oriented. Use Community when you need the deeper layer."
				description="That is the architecture now: free pages explain the terrain, and Community carries the richer, more current, more supportive next step."
				primaryHref="/community"
				primaryLabel="Explore Community"
				secondaryHref="/guides"
				secondaryLabel="Browse Guides"
			/>
		</div>
	</section>
</article>

<style>
	.guide-page {
		background: #f8f2df;
		color: #111111;
	}

	.guide-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.guide-hero {
		padding: clamp(5rem, 8vw, 7rem) 0 4rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.2), transparent 26rem),
			linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
	}

	.hero-grid,
	.body-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.38fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: start;
	}

	.eyebrow,
	.meta-kicker,
	.sidebar-kicker,
	.related-category {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.eyebrow {
		color: rgba(217, 4, 43, 0.82);
	}

	.hero-copy h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 5vw, 5rem);
		line-height: 0.94;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}

	.guide-lede {
		margin: 1.2rem 0 0;
		max-width: 46rem;
		font-size: clamp(1.05rem, 1.45vw, 1.22rem);
		line-height: 1.85;
		color: rgba(17, 17, 17, 0.8);
	}

	.hero-meta {
		padding: 1.35rem;
		border-radius: 1.7rem;
		background: linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		color: white;
		box-shadow: 0 20px 46px rgba(0, 0, 0, 0.14);
	}

	.meta-kicker,
	.sidebar-kicker {
		color: rgba(242, 183, 5, 0.88);
	}

	.meta-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.95rem 0;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.meta-row:first-of-type {
		margin-top: 0.8rem;
	}

	.meta-row span,
	.meta-row strong {
		font-size: 0.92rem;
		line-height: 1.5;
	}

	.guide-body-section,
	.guide-related-section,
	.guide-cta-section,
	.guide-preview-section {
		padding: clamp(4.5rem, 7vw, 6rem) 0;
	}

	.guide-body-section {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.14), transparent 26rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.guide-preview-section {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 24rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
	}

	.guide-related-section {
		background:
			radial-gradient(circle at top right, rgba(3, 140, 37, 0.14), transparent 24rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.guide-cta-section {
		background:
			radial-gradient(circle at top right, rgba(217, 4, 43, 0.12), transparent 22rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
	}

	.guide-body {
		display: grid;
		gap: 2.2rem;
	}

	.guide-section {
		display: grid;
		gap: 1rem;
	}

	.guide-section h2 {
		margin: 0;
		font-size: clamp(1.8rem, 3vw, 2.7rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
	}

	.guide-section p,
	.sidebar-card p,
	.related-card p,
	.sidebar-card li {
		margin: 0;
		font-size: 1rem;
		line-height: 1.85;
		color: rgba(17, 17, 17, 0.8);
	}

	.inline-upsell {
		margin-top: 1rem;
	}

	.guide-sidebar {
		display: grid;
		gap: 1rem;
		position: sticky;
		top: 6rem;
	}

	.sidebar-card {
		padding: 1.2rem;
		border-radius: 1.5rem;
		background: linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
	}

	.sidebar-card ul {
		display: grid;
		gap: 0.6rem;
		margin: 0.85rem 0 0;
		padding-left: 1rem;
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 2rem;
	}

	.related-card {
		display: grid;
		gap: 0.8rem;
		padding: 1.25rem;
		border-radius: 1.5rem;
		background: linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
		text-decoration: none;
	}

	.related-card h3 {
		margin: 0;
		font-size: 1.25rem;
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: #111111;
	}

	.related-category {
		color: rgba(17, 17, 17, 0.56);
	}

	@media (max-width: 960px) {
		.guide-shell {
			padding-inline: 1rem;
		}

		.hero-grid,
		.body-grid,
		.related-grid {
			grid-template-columns: 1fr;
		}

		.guide-sidebar {
			position: static;
		}
	}
</style>
