<script>
	/**
	 * @typedef {Object} Item
	 * @property {string} title
	 * @property {string} description
	 *
	 * @typedef {Object} Props
	 * @property {string} eyebrow
	 * @property {string} title
	 * @property {string} description
	 * @property {Item[]} [items]
	 * @property {string} [primaryHref]
	 * @property {string} [primaryLabel]
	 * @property {string} [secondaryHref]
	 * @property {string} [secondaryLabel]
	 */

	/** @type {Props} */
	let {
		eyebrow,
		title,
		description,
		items = [],
		primaryHref = '/community',
		primaryLabel = 'Explore Community',
		secondaryHref = '/start-here',
		secondaryLabel = 'Use Start Here'
	} = $props();
</script>

<aside class="guide-upsell" aria-label="Community depth preview">
	<div class="guide-upsell-copy">
		<p class="guide-upsell-eyebrow">{eyebrow}</p>
		<h3>{title}</h3>
		<p class="guide-upsell-description">{description}</p>
		<div class="guide-upsell-actions">
			<a href={primaryHref} class="guide-upsell-primary">{primaryLabel}</a>
			<a href={secondaryHref} class="guide-upsell-secondary">{secondaryLabel}</a>
		</div>
	</div>

	{#if items.length}
		<div class="guide-upsell-grid">
			{#each items as item}
				<article class="guide-upsell-card">
					<p class="guide-upsell-card-title">{item.title}</p>
					<p class="guide-upsell-card-description">{item.description}</p>
					<span class="guide-upsell-badge">Deeper support</span>
				</article>
			{/each}
		</div>
	{/if}
</aside>

<style>
	.guide-upsell {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 2rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.14), transparent 48%),
			linear-gradient(180deg, #111111 0%, #1b1b1b 100%);
		color: white;
		box-shadow: 0 24px 56px rgba(0, 0, 0, 0.16);
	}

	.guide-upsell-copy {
		display: grid;
		gap: 1rem;
		align-content: start;
	}

	.guide-upsell-eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.9);
	}

	h3 {
		margin: 0;
		font-size: clamp(1.8rem, 3vw, 2.7rem);
		line-height: 0.98;
		letter-spacing: -0.05em;
	}

	.guide-upsell-description {
		margin: 0;
		font-size: 1rem;
		line-height: 1.75;
		color: rgba(255, 248, 239, 0.8);
	}

	.guide-upsell-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.guide-upsell-primary,
	.guide-upsell-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3rem;
		padding: 0 1.1rem;
		border-radius: 999px;
		font-size: 0.92rem;
		font-weight: 700;
		text-decoration: none;
	}

	.guide-upsell-primary {
		background: linear-gradient(135deg, #d9042b, #b10323);
		color: white;
	}

	.guide-upsell-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.guide-upsell-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.85rem;
	}

	.guide-upsell-card {
		display: grid;
		gap: 0.7rem;
		padding: 1rem;
		border-radius: 1.4rem;
		background: rgba(255, 255, 255, 0.06);
	}

	.guide-upsell-card-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: #fff8ef;
	}

	.guide-upsell-card-description {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: rgba(255, 248, 239, 0.74);
	}

	.guide-upsell-badge {
		margin-top: auto;
		display: inline-flex;
		width: fit-content;
		align-items: center;
		padding: 0.3rem 0.6rem;
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
		.guide-upsell,
		.guide-upsell-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
