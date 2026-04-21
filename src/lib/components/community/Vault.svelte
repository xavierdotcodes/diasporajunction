<script>
	/**
	 * @typedef {Object} ResourceItem
	 * @property {string} type
	 * @property {string} title
	 * @property {string} description
	 * @property {string} meta
	 * @property {string} actionLabel
	 * @property {string} actionHref
	 *
	 * @typedef {Object} Props
	 * @property {ResourceItem[]} items
	 */

	/** @type {Props} */
	let { items = [] } = $props();
</script>

<div class="vault-grid">
	{#each items as item}
		<article class="vault-card">
			<p class="vault-type">{item.type}</p>
			<h3>{item.title}</h3>
			<p class="vault-description">{item.description}</p>
			<p class="vault-meta">{item.meta}</p>
			<a href={item.actionHref} class="vault-action">{item.actionLabel}</a>
		</article>
	{/each}
</div>

<style>
	.vault-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.vault-card {
		display: grid;
		gap: 0.85rem;
		padding: 1.35rem;
		border-radius: 1.55rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.16), transparent 56%),
			linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		color: #fff8ef;
		box-shadow: 0 24px 50px rgba(0, 0, 0, 0.16);
	}

	.vault-type {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.88);
	}

	h3 {
		margin: 0;
		font-size: clamp(1.25rem, 2vw, 1.7rem);
		line-height: 1.02;
		letter-spacing: -0.03em;
	}

	.vault-description,
	.vault-meta {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.7;
	}

	.vault-description {
		color: rgba(255, 248, 239, 0.8);
	}

	.vault-meta {
		color: rgba(255, 248, 239, 0.56);
	}

	.vault-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		min-height: 2.65rem;
		padding: 0 1rem;
		border-radius: 999px;
		background: #d9042b;
		color: white;
		font-size: 0.9rem;
		font-weight: 700;
		text-decoration: none;
	}

	@media (max-width: 960px) {
		.vault-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
