<script>
	/**
	 * @typedef {Object} Item
	 * @property {string} title
	 * @property {string} description
	 * @property {string} [eyebrow]
	 * @property {string} [href]
	 * @property {string} [cta]
	 * @property {'Free' | 'Preview' | 'Gated'} [access]
	 * @property {'gold' | 'green' | 'red' | 'dark'} [accent]
	 * @property {boolean} [locked]
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Item[]} items
	 * @property {'light' | 'dark'} [tone]
	 * @property {number} [columns]
	 */

	/** @type {Props} */
	let { items = [], tone = 'light', columns = 3 } = $props();
</script>

<div class:dark={tone === 'dark'} class={`access-grid cols-${columns}`}>
	{#each items as item}
		<svelte:element
			this={item.href ? 'a' : 'article'}
			href={item.href}
			class:locked={item.locked}
			class={`access-card ${item.accent ?? 'dark'}`}
		>
			<div class="access-head">
				{#if item.access}
					<span class="access-badge">{item.access}</span>
				{/if}
				{#if item.eyebrow}
					<p class="access-eyebrow">{item.eyebrow}</p>
				{/if}
			</div>

			<h3>{item.title}</h3>
			<p class="access-description">{item.description}</p>

			{#if item.cta || item.locked}
				<div class="access-meta">
					{#if item.locked}
						<span class="lock-chip">Member depth</span>
					{/if}
					{#if item.cta}
						<span class="access-link">{item.cta}</span>
					{/if}
				</div>
			{/if}
		</svelte:element>
	{/each}
</div>

<style>
	.access-grid {
		display: grid;
		gap: 1rem;
	}

	.cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.cols-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.cols-4 {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.access-card {
		display: grid;
		gap: 1rem;
		min-height: 15rem;
		padding: 1.35rem;
		border-radius: 1.6rem;
		text-decoration: none;
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.1);
		transition:
			transform 180ms ease,
			box-shadow 180ms ease;
	}

	.access-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 22px 52px rgba(0, 0, 0, 0.14);
	}

	.access-card.dark {
		background: linear-gradient(180deg, #111111 0%, #1b1b1b 100%);
		color: white;
	}

	.access-card.gold {
		background: linear-gradient(180deg, #f2b705 0%, #dfa200 100%);
		color: #111111;
	}

	.access-card.green {
		background: linear-gradient(180deg, #038c25 0%, #026b1d 100%);
		color: white;
	}

	.access-card.red {
		background: linear-gradient(180deg, #d9042b 0%, #b10323 100%);
		color: white;
	}

	.access-card.locked {
		position: relative;
	}

	.access-card.locked::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.08));
		pointer-events: none;
	}

	.access-head {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.access-badge,
	.access-eyebrow,
	.lock-chip {
		display: inline-flex;
		align-items: center;
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.access-badge {
		background: rgba(255, 255, 255, 0.14);
	}

	.access-eyebrow {
		background: rgba(17, 17, 17, 0.08);
	}

	.access-card.dark .access-eyebrow,
	.access-card.green .access-eyebrow,
	.access-card.red .access-eyebrow {
		background: rgba(255, 255, 255, 0.12);
	}

	h3 {
		margin: 0;
		font-size: clamp(1.35rem, 1.9vw, 1.9rem);
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.access-description {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.72;
		opacity: 0.86;
	}

	.access-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		align-items: center;
		margin-top: auto;
	}

	.lock-chip {
		background: rgba(17, 17, 17, 0.08);
	}

	.access-card.dark .lock-chip,
	.access-card.green .lock-chip,
	.access-card.red .lock-chip {
		background: rgba(255, 255, 255, 0.12);
	}

	.access-link {
		font-size: 0.9rem;
		font-weight: 700;
	}

	@media (max-width: 960px) {
		.cols-2,
		.cols-3,
		.cols-4 {
			grid-template-columns: 1fr;
		}
	}
</style>
