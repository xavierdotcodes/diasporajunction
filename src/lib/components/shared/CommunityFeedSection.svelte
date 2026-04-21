<script>
	/**
	 * @typedef {Object} Entry
	 * @property {string} title
	 * @property {string} summary
	 * @property {string} [meta]
	 * @property {string} [tag]
	 * @property {string} [status]
	 *
	 * @typedef {Object} Props
	 * @property {string} eyebrow
	 * @property {string} title
	 * @property {string} description
	 * @property {Entry[]} entries
	 * @property {'light' | 'dark'} [tone]
	 * @property {number} [columns]
	 */

	/** @type {Props} */
	let {
		eyebrow,
		title,
		description,
		entries = [],
		tone = 'light',
		columns = 3
	} = $props();
</script>

<section class:dark={tone === 'dark'} class="feed-section">
	<div class="feed-copy">
		<p class="feed-eyebrow">{eyebrow}</p>
		<h3>{title}</h3>
		<p class="feed-description">{description}</p>
	</div>

	<div class={`feed-grid cols-${columns}`}>
		{#each entries as entry}
			<article class="feed-card">
				<div class="feed-card-head">
					{#if entry.tag}
						<p class="feed-tag">{entry.tag}</p>
					{/if}
					{#if entry.status}
						<span class="feed-status">{entry.status}</span>
					{/if}
				</div>
				<h4>{entry.title}</h4>
				<p class="feed-summary">{entry.summary}</p>
				{#if entry.meta}
					<p class="feed-meta">{entry.meta}</p>
				{/if}
			</article>
		{/each}
	</div>
</section>

<style>
	.feed-section {
		display: grid;
		gap: 1.5rem;
	}

	.feed-copy {
		display: grid;
		gap: 0.9rem;
		max-width: 44rem;
	}

	.feed-eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.62);
	}

	.dark .feed-eyebrow {
		color: rgba(242, 183, 5, 0.88);
	}

	h3 {
		margin: 0;
		font-size: clamp(1.8rem, 3.4vw, 3rem);
		line-height: 0.98;
		letter-spacing: -0.05em;
		color: #111111;
	}

	.dark h3 {
		color: #fff8ef;
	}

	.feed-description {
		margin: 0;
		font-size: 1rem;
		line-height: 1.75;
		color: rgba(17, 17, 17, 0.78);
	}

	.dark .feed-description {
		color: rgba(255, 248, 239, 0.76);
	}

	.feed-grid {
		display: grid;
		gap: 1rem;
	}

	.cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.cols-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.feed-card {
		display: grid;
		gap: 0.85rem;
		min-height: 13.5rem;
		padding: 1.2rem;
		border-radius: 1.5rem;
		background: linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
	}

	.dark .feed-card {
		background: linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		box-shadow: 0 20px 46px rgba(0, 0, 0, 0.16);
	}

	.feed-card-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
	}

	.feed-tag,
	.feed-status {
		display: inline-flex;
		align-items: center;
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.feed-tag {
		margin: 0;
		background: rgba(17, 17, 17, 0.08);
		color: rgba(17, 17, 17, 0.68);
	}

	.dark .feed-tag {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 248, 239, 0.72);
	}

	.feed-status {
		background: rgba(242, 183, 5, 0.14);
		color: #c98e00;
	}

	h4 {
		margin: 0;
		font-size: 1.18rem;
		line-height: 1.08;
		letter-spacing: -0.03em;
		color: #111111;
	}

	.dark h4 {
		color: #fff8ef;
	}

	.feed-summary,
	.feed-meta {
		margin: 0;
		font-size: 0.94rem;
		line-height: 1.68;
	}

	.feed-summary {
		color: rgba(17, 17, 17, 0.78);
	}

	.dark .feed-summary {
		color: rgba(255, 248, 239, 0.76);
	}

	.feed-meta {
		margin-top: auto;
		color: rgba(17, 17, 17, 0.52);
	}

	.dark .feed-meta {
		color: rgba(255, 248, 239, 0.52);
	}

	@media (max-width: 960px) {
		.cols-2,
		.cols-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
