<script>
	import LeadCaptureInline from '$lib/components/lead/LeadCaptureInline.svelte';
	import AccessCardGrid from '$lib/components/shared/AccessCardGrid.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import { DIASPORAU_MEDIA } from '$lib/components/shared/media.js';
	import SectionHeader from '$lib/components/shared/SectionHeader.svelte';
	import StrategicCta from '$lib/components/shared/StrategicCta.svelte';
	import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('free.blog.page');

	let { data } = $props();

	const starterCards = $derived(
		(data.starterPosts ?? []).map((item, index) => ({
			title: item.title,
			description: item.description,
			href: item.href,
			cta: index === 0 ? 'Read this first' : 'Read article',
			access: 'Start here',
			eyebrow: item.category,
			accent: ['red', 'gold', 'green'][index % 3]
		}))
	);

	const latestCards = $derived(
		(data.latestPosts ?? []).slice(0, 9).map((item, index) => ({
			title: item.title,
			description: item.description,
			href: item.href,
			cta: 'Read article',
			eyebrow: item.category,
			access: 'Open',
			accent: ['dark', 'gold', 'green', 'red'][index % 4]
		}))
	);
</script>

<svelte:head>
	<title>Blog | DiasporaJunxion</title>
	<meta
		name="description"
		content="Read grounded articles for diaspora people thinking about visiting, relocating, belonging, and building a life in Ghana with more clarity."
	/>
</svelte:head>

<div class="blog-page">
	<Hero
		variant="page"
		subtitle="Blog"
		description="Read grounded pieces on visiting, relocating, family life, belonging, and making smarter decisions about Ghana. Start with the article that matches the question you are holding right now."
		{...DIASPORAU_MEDIA}
	>
		{#snippet title()}
			<h1>Articles for people trying to get clearer about Ghana.</h1>
		{/snippet}

		{#snippet aside()}
			<div class="hero-panel">
				<p class="panel-kicker">Best First Reads</p>
				<ul>
					<li>Start with visiting vs living if you need a reality check</li>
					<li>Read the family pieces if children are part of the decision</li>
					<li>Use the free guide when you want a calmer starting point</li>
				</ul>
			</div>
		{/snippet}
	</Hero>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Featured Read"
				title="Start with the article that saves people from the biggest mistake."
				description="A lot of confusion starts when a short visit gets mistaken for a full preview of life in Ghana. This is the best place to begin if you are trying to separate excitement from day-to-day reality."
			/>

			{#if data.featuredPost}
				<a href={data.featuredPost.href} class="featured-article">
					<div class="featured-copy">
						<p class="featured-label">{data.featuredPost.category}</p>
						<h2>{data.featuredPost.title}</h2>
						<p>{data.featuredPost.description}</p>
						<span>Read the article</span>
					</div>
				</a>
			{/if}
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Start With These"
				title="If you are new here, these are the strongest first reads."
				description="Start with the basics that help you ask better questions before the idea of Ghana turns into a plan."
				tone="dark"
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={starterCards} />
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell">
			<SectionHeader
				eyebrow="Browse By Topic"
				title="Choose the lane that fits the question you are trying to answer."
				description="You do not need to read everything. Start with the category that sounds most like your current season."
			/>

			<div class="category-grid">
				{#each data.categories as category}
					<article class="category-card">
						<h3>{category.title}</h3>
						<p>{category.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<SectionHeader
				eyebrow="More To Read"
				title="Keep reading until the next step feels obvious."
				description="Each article should help you understand a little more clearly what Ghana is asking of you, and what you should do next."
				tone="dark"
			/>

			<div class="spacer-lg"></div>
			<AccessCardGrid items={latestCards} columns={3} />
		</div>
	</section>

	<section class="page-section section-cream">
		<div class="page-shell narrow-shell">
			<LeadCaptureInline
				title="Want a practical starting point in your inbox?"
				description={`Get the free guide: ${DEFAULT_LEAD_MAGNET_NAME}`}
				buttonText="Send Me The Guide"
				source="blog_page"
				leadMagnet={DEFAULT_LEAD_MAGNET_NAME}
				entryPage="/blog"
			/>
		</div>
	</section>

	<section class="page-section section-dark">
		<div class="page-shell">
			<StrategicCta
				eyebrow="Next Step"
				title="Read in public. Go deeper when you need more than articles."
				description="The blog helps you get your bearings. Community is there for more current insight, trusted resources, and the next layer of support once your questions get more serious."
				primaryHref="/community"
				primaryLabel="See What Community Includes"
				secondaryHref="/start-here"
				secondaryLabel="Start Here"
			/>
		</div>
	</section>
</div>

<style>
	.blog-page {
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

	.panel-kicker,
	.featured-label {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
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
		margin-bottom: 0.85rem;
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

	.featured-article {
		display: grid;
		margin-top: 2rem;
		padding: clamp(1.5rem, 3vw, 2.4rem);
		border-radius: 2rem;
		background:
			radial-gradient(circle at top left, rgba(217, 4, 43, 0.14), transparent 48%),
			linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		color: #111111;
		text-decoration: none;
		box-shadow: 0 24px 56px rgba(0, 0, 0, 0.1);
	}

	.featured-copy {
		display: grid;
		gap: 1rem;
		max-width: 42rem;
	}

	.featured-label {
		color: rgba(217, 4, 43, 0.84);
	}

	.featured-copy h2 {
		margin: 0;
		font-size: clamp(2rem, 4vw, 3.8rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}

	.featured-copy p {
		margin: 0;
		font-size: clamp(1rem, 1.3vw, 1.12rem);
		line-height: 1.78;
		color: rgba(17, 17, 17, 0.78);
	}

	.featured-copy span {
		font-size: 0.95rem;
		font-weight: 700;
		color: #d9042b;
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
		display: grid;
		gap: 0.8rem;
		min-height: 12rem;
		padding: 1.35rem;
		border-radius: 1.6rem;
		background: white;
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
	}

	.category-card h3 {
		margin: 0;
		font-size: 1.4rem;
		line-height: 1.08;
		letter-spacing: -0.03em;
	}

	.category-card p {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.72;
		color: rgba(17, 17, 17, 0.74);
	}

	@media (max-width: 960px) {
		.category-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.page-shell {
			padding-inline: 1rem;
		}

		.featured-copy h2 {
			font-size: clamp(1.9rem, 9vw, 3rem);
		}
	}
</style>
