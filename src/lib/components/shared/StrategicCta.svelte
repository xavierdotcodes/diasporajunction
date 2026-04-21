<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} eyebrow
	 * @property {string} title
	 * @property {string} description
	 * @property {string} primaryHref
	 * @property {string} primaryLabel
	 * @property {string} [secondaryHref]
	 * @property {string} [secondaryLabel]
	 * @property {'light' | 'dark'} [tone]
	 */

	/** @type {Props} */
	let {
		eyebrow,
		title,
		description,
		primaryHref,
		primaryLabel,
		secondaryHref = '',
		secondaryLabel = '',
		tone = 'dark'
	} = $props();
</script>

<section class:light={tone === 'light'} class="strategic-cta">
	<p class="cta-eyebrow">{eyebrow}</p>
	<h2>{title}</h2>
	<p class="cta-description">{description}</p>
	<div class="cta-actions">
		<a href={primaryHref} class="cta-primary">{primaryLabel}</a>
		{#if secondaryHref && secondaryLabel}
			<a href={secondaryHref} class="cta-secondary">{secondaryLabel}</a>
		{/if}
	</div>
</section>

<style>
	.strategic-cta {
		display: grid;
		gap: 1rem;
		padding: 1.75rem;
		border-radius: 2rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.14), transparent 45%),
			linear-gradient(180deg, #111111 0%, #1b1b1b 100%);
		color: white;
	}

	.strategic-cta.light {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 45%),
			linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		color: #111111;
	}

	.cta-eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.88);
	}

	.light .cta-eyebrow {
		color: rgba(17, 17, 17, 0.62);
	}

	h2 {
		margin: 0;
		font-size: clamp(1.9rem, 4vw, 3.2rem);
		line-height: 0.98;
		letter-spacing: -0.05em;
	}

	.cta-description {
		margin: 0;
		font-size: 1rem;
		line-height: 1.75;
		color: rgba(255, 248, 239, 0.8);
	}

	.light .cta-description {
		color: rgba(17, 17, 17, 0.76);
	}

	.cta-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}

	.cta-primary,
	.cta-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3rem;
		padding: 0 1.2rem;
		border-radius: 999px;
		font-size: 0.94rem;
		font-weight: 700;
		text-decoration: none;
	}

	.cta-primary {
		background: linear-gradient(135deg, #d9042b, #b10323);
		color: white;
	}

	.cta-secondary {
		background: rgba(255, 255, 255, 0.08);
		color: white;
	}

	.light .cta-secondary {
		background: rgba(17, 17, 17, 0.08);
		color: #111111;
	}
</style>
