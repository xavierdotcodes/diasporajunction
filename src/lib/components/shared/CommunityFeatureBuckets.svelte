<script>
	/**
	 * @typedef {Object} Bucket
	 * @property {string} name
	 * @property {string} summary
	 * @property {string[]} points
	 * @property {'Free' | 'Preview' | 'Gated'} [access]
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Bucket[]} buckets
	 * @property {'light' | 'dark'} [tone]
	 */

	/** @type {Props} */
	let { buckets = [], tone = 'light' } = $props();
</script>

<div class:dark={tone === 'dark'} class="bucket-grid">
	{#each buckets as bucket}
		<article class="bucket-card">
			<div class="bucket-head">
				<h3>{bucket.name}</h3>
				{#if bucket.access}
					<span class="bucket-access">{bucket.access}</span>
				{/if}
			</div>
			<p class="bucket-summary">{bucket.summary}</p>
			<ul>
				{#each bucket.points as point}
					<li>{point}</li>
				{/each}
			</ul>
		</article>
	{/each}
</div>

<style>
	.bucket-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.bucket-card {
		display: grid;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1.5rem;
		background: linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		box-shadow: 0 18px 44px rgba(0, 0, 0, 0.1);
	}

	.dark .bucket-card {
		background: linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
	}

	.bucket-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	h3 {
		margin: 0;
		font-size: 1.35rem;
		line-height: 1;
		letter-spacing: -0.03em;
		color: #111111;
	}

	.dark h3 {
		color: #fff8ef;
	}

	.bucket-access {
		display: inline-flex;
		align-items: center;
		padding: 0.32rem 0.6rem;
		border-radius: 999px;
		background: rgba(242, 183, 5, 0.14);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #c98e00;
	}

	.bucket-summary {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.68;
		color: rgba(17, 17, 17, 0.76);
	}

	.dark .bucket-summary {
		color: rgba(255, 248, 239, 0.76);
	}

	ul {
		display: grid;
		gap: 0.55rem;
		margin: 0;
		padding-left: 1rem;
	}

	li {
		font-size: 0.92rem;
		line-height: 1.6;
		color: rgba(17, 17, 17, 0.74);
	}

	.dark li {
		color: rgba(255, 248, 239, 0.72);
	}

	@media (max-width: 960px) {
		.bucket-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
