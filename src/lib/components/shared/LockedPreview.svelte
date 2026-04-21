<script>
	/**
	 * @typedef {Object} PreviewItem
	 * @property {string} title
	 * @property {string} description
	 */

	/**
	 * @typedef {Object} Props
	 * @property {string} eyebrow
	 * @property {string} title
	 * @property {string} description
	 * @property {PreviewItem[]} [items]
	 * @property {string} [ctaHref]
	 * @property {string} [ctaLabel]
	 */

	/** @type {Props} */
	let {
		eyebrow,
		title,
		description,
		items = [],
		ctaHref = '/community',
		ctaLabel = 'Explore Community'
	} = $props();
</script>

<section class="locked-preview">
	<div class="locked-copy">
		<p class="locked-eyebrow">{eyebrow}</p>
		<h3>{title}</h3>
		<p class="locked-description">{description}</p>
		<a href={ctaHref} class="locked-cta">{ctaLabel}</a>
	</div>

	<div class="locked-grid" aria-label="Preview of gated content">
		{#each items as item}
			<article class="locked-card">
				<div class="locked-card-overlay" aria-hidden="true"></div>
				<p class="locked-card-title">{item.title}</p>
				<p class="locked-card-description">{item.description}</p>
				<span class="locked-badge">Locked</span>
			</article>
		{/each}
	</div>
</section>

<style>
	.locked-preview {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 1.25rem;
		padding: 1.5rem;
		border-radius: 2rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.14), transparent 45%),
			linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		color: white;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
	}

	.locked-copy {
		display: grid;
		gap: 1rem;
		align-content: start;
	}

	.locked-eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.88);
	}

	h3 {
		margin: 0;
		font-size: clamp(1.8rem, 3.4vw, 3rem);
		line-height: 0.98;
		letter-spacing: -0.05em;
	}

	.locked-description {
		margin: 0;
		font-size: 1rem;
		line-height: 1.78;
		color: rgba(255, 248, 239, 0.8);
	}

	.locked-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		min-height: 3rem;
		padding: 0 1.2rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #d9042b, #b10323);
		color: white;
		font-weight: 700;
		text-decoration: none;
	}

	.locked-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.9rem;
	}

	.locked-card {
		position: relative;
		display: grid;
		gap: 0.7rem;
		min-height: 12rem;
		padding: 1rem;
		border-radius: 1.4rem;
		background: rgba(255, 255, 255, 0.06);
		overflow: hidden;
	}

	.locked-card-overlay {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
			repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03) 10px, transparent 10px, transparent 20px);
		backdrop-filter: blur(10px);
	}

	.locked-card-title,
	.locked-card-description,
	.locked-badge {
		position: relative;
		z-index: 1;
	}

	.locked-card-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: #fff8ef;
	}

	.locked-card-description {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: rgba(255, 248, 239, 0.72);
		filter: blur(1.5px);
	}

	.locked-badge {
		margin-top: auto;
		display: inline-flex;
		align-items: center;
		width: fit-content;
		padding: 0.32rem 0.6rem;
		border-radius: 999px;
		background: rgba(242, 183, 5, 0.14);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #f2b705;
	}

	@media (max-width: 960px) {
		.locked-preview,
		.locked-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
