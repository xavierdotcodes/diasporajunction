<script>
	import GuideUpsellBlock from '$lib/components/shared/GuideUpsellBlock.svelte';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('free.blog.detail.page');

	let { data } = $props();
</script>

<article class="article-page">
	<section class="article-hero">
		<div class="article-shell hero-grid">
			<div class="hero-copy">
				<p class="eyebrow">{data.article.category}</p>
				<h1>{data.article.title}</h1>
				<p class="article-lede">{data.article.lede}</p>
			</div>

			<div class="hero-meta">
				<p class="meta-kicker">Best For</p>
				<div class="meta-row">
					<span>Read time</span>
					<strong>{data.article.readTime}</strong>
				</div>
				<div class="meta-row">
					<span>Use this when</span>
					<strong>You need a clearer next step</strong>
				</div>
				<div class="meta-row">
					<span>Next move</span>
					<strong>Checklist, Relocate, or Community</strong>
				</div>
			</div>
		</div>
	</section>

	<section class="article-body-section">
		<div class="article-shell body-grid">
			<div class="article-body">
				{#each data.article.sections as section, index}
					<section class="article-section">
						<h2>{section.title}</h2>
						{#each section.paragraphs as paragraph}
							<p>{paragraph}</p>
						{/each}

						{#if index === 0}
							<div class="inline-upsell">
								<GuideUpsellBlock
									eyebrow="Need A Practical Starting Point?"
									title="Get the free guide, then decide what to read or do next."
									description="If this article sounds like your situation, the free Ghana reality guide will help you slow down, compare your options, and move with more clarity."
									items={data.article.communityPreview.slice(0, 2)}
									primaryHref="/checklist"
									primaryLabel="Get The Free Guide"
									secondaryHref="/community"
									secondaryLabel="See Community"
								/>
							</div>
						{/if}
					</section>
				{/each}
			</div>

			<aside class="article-sidebar">
				<div class="sidebar-card">
					<p class="sidebar-kicker">Why this article matters</p>
					<p>
						This piece is meant to help you get your bearings before emotion, urgency, or other
						people’s opinions start driving the decision for you.
					</p>
				</div>

				<div class="sidebar-card">
					<p class="sidebar-kicker">Best next steps</p>
					<ul>
						<li><a href="/checklist">Get the free guide</a></li>
						<li><a href="/start-here">Use Start Here</a></li>
						<li><a href="/relocate">Go deeper on relocation</a></li>
					</ul>
				</div>
			</aside>
		</div>
	</section>

	<section class="article-preview-section">
		<div class="article-shell">
			<GuideUpsellBlock
				eyebrow="When You Need More Than Articles"
				title="That is where the deeper layer starts to matter."
				description="The blog helps you understand the terrain. Community is where you go when you want more current insight, more useful support, and more trusted next steps."
				items={data.article.communityPreview}
				primaryHref="/community"
				primaryLabel="See What Community Includes"
				secondaryHref="/checklist"
				secondaryLabel="Get The Free Guide"
			/>
		</div>
	</section>

	<section class="article-related-section">
		<div class="article-shell">
			<SectionHeader
				eyebrow="Read Next"
				title="Keep following the question until the next step feels obvious."
				description="These are the next articles to read if you want to keep building a clearer picture of Ghana."
			/>

			<div class="related-grid">
				{#each data.relatedArticles as item}
					<a href={item.href} class="related-card">
						<p class="related-category">{item.category}</p>
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="article-cta-section">
		<div class="article-shell">
			<StrategicCta
				tone="light"
				eyebrow="Next Step"
				title="Use the article to get clearer. Use the site to keep moving."
				description="Start with the free guide if you want a calmer next move. Go to Start Here if you still need direction. Step into Community when you want the deeper layer."
				primaryHref="/checklist"
				primaryLabel="Get The Free Guide"
				secondaryHref="/start-here"
				secondaryLabel="Start Here"
			/>
		</div>
	</section>
</article>

<style>
	.article-page {
		background: #f8f2df;
		color: #111111;
	}

	.article-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.article-hero {
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

	.article-lede {
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

	.article-body-section,
	.article-related-section,
	.article-cta-section,
	.article-preview-section {
		padding: clamp(4.5rem, 7vw, 6rem) 0;
	}

	.article-body-section {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.14), transparent 26rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.article-preview-section {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 24rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
	}

	.article-related-section {
		background:
			radial-gradient(circle at top right, rgba(3, 140, 37, 0.14), transparent 24rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.article-cta-section {
		background:
			radial-gradient(circle at top right, rgba(217, 4, 43, 0.12), transparent 22rem),
			linear-gradient(180deg, #111111 0%, #050505 100%);
	}

	.article-body {
		display: grid;
		gap: 2.2rem;
	}

	.article-section {
		display: grid;
		gap: 1rem;
	}

	.article-section h2 {
		margin: 0;
		font-size: clamp(1.7rem, 2.3vw, 2.5rem);
		line-height: 1.02;
		letter-spacing: -0.04em;
	}

	.article-section p {
		margin: 0;
		font-size: clamp(1rem, 1.3vw, 1.08rem);
		line-height: 1.9;
		color: rgba(17, 17, 17, 0.8);
	}

	.inline-upsell {
		margin-top: 0.5rem;
	}

	.article-sidebar {
		display: grid;
		gap: 1rem;
		position: sticky;
		top: 6rem;
	}

	.sidebar-card {
		display: grid;
		gap: 0.9rem;
		padding: 1.2rem;
		border-radius: 1.5rem;
		background: white;
		box-shadow: 0 16px 38px rgba(0, 0, 0, 0.08);
	}

	.sidebar-card p,
	.sidebar-card ul {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.76);
	}

	.sidebar-card ul {
		display: grid;
		gap: 0.75rem;
		padding-left: 1rem;
	}

	.sidebar-card a {
		color: #d9042b;
		text-decoration: none;
		font-weight: 600;
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
		padding: 1.35rem;
		border-radius: 1.6rem;
		background: white;
		color: #111111;
		text-decoration: none;
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
	}

	.related-category {
		color: rgba(217, 4, 43, 0.8);
	}

	.related-card h3 {
		margin: 0;
		font-size: 1.35rem;
		line-height: 1.08;
		letter-spacing: -0.03em;
	}

	.related-card p:last-child {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.74);
	}

	@media (max-width: 960px) {
		.hero-grid,
		.body-grid,
		.related-grid {
			grid-template-columns: 1fr;
		}

		.article-sidebar {
			position: static;
		}
	}

	@media (max-width: 768px) {
		.article-shell {
			padding-inline: 1rem;
		}
	}
</style>
