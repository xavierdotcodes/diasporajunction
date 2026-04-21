<script>
	/**
	 * @typedef {Object} NavItem
	 * @property {string} label
	 * @property {string} href
	 * @property {string} description
	 *
	 * @typedef {Object} Props
	 * @property {NavItem[]} items
	 */

	/** @type {Props} */
	let { items = [] } = $props();
</script>

<nav class="workspace-nav" aria-label="Community workspace sections">
	{#each items as item}
		<a href={item.href} class="workspace-link">
			<span class="workspace-label">{item.label}</span>
			<span class="workspace-description">{item.description}</span>
		</a>
	{/each}
</nav>

<style>
	.workspace-nav {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.workspace-link {
		display: grid;
		gap: 0.55rem;
		padding: 1.15rem;
		border-radius: 1.4rem;
		background: linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		color: #111111;
		text-decoration: none;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
		transition:
			transform 180ms ease,
			box-shadow 180ms ease;
	}

	.workspace-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 24px 44px rgba(0, 0, 0, 0.1);
	}

	.workspace-label {
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.workspace-description {
		font-size: 0.92rem;
		line-height: 1.65;
		color: rgba(17, 17, 17, 0.68);
	}

	@media (max-width: 960px) {
		.workspace-nav {
			grid-template-columns: 1fr;
		}
	}
</style>
