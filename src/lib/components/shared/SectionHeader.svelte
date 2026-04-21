<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} eyebrow
	 * @property {string} title
	 * @property {string} [description]
	 * @property {'light' | 'dark'} [tone]
	 * @property {'left' | 'center'} [align]
	 */

	/** @type {Props} */
	let {
		eyebrow,
		title,
		description = '',
		tone = 'light',
		align = 'left'
	} = $props();
</script>

<header class:dark={tone === 'dark'} class:center={align === 'center'} class="section-header">
	<p class="section-eyebrow">{eyebrow}</p>
	<h2>{title}</h2>
	{#if description}
		<p class="section-description">{description}</p>
	{/if}
</header>

<style>
	.section-header {
		display: grid;
		gap: 1rem;
		max-width: 44rem;
	}

	.section-header.center {
		margin-inline: auto;
		text-align: center;
	}

	.section-eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.64);
	}

	.section-header.dark .section-eyebrow {
		color: rgba(242, 183, 5, 0.88);
	}

	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4.4vw, 4rem);
		line-height: 0.96;
		letter-spacing: -0.05em;
		text-wrap: balance;
		color: #111111;
	}

	.section-header.dark h2 {
		color: #fff8ef;
	}

	.section-description {
		margin: 0;
		font-size: clamp(1rem, 1.3vw, 1.12rem);
		line-height: 1.8;
		color: rgba(17, 17, 17, 0.78);
	}

	.section-header.dark .section-description {
		color: rgba(255, 248, 239, 0.78);
	}
</style>
