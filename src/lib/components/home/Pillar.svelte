<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/components/home/Pillar.svelte');

	const ACCENTS = {
		gold: {
			accent: '#F2B705',
			wash: 'rgba(242, 183, 5, 0.20)',
			panel: '#FFF5D8',
			text: '#111111'
		},
		green: {
			accent: '#038C25',
			wash: 'rgba(3, 140, 37, 0.2)',
			panel: '#E7F7EB',
			text: '#111111'
		},
		red: {
			accent: '#D9042B',
			wash: 'rgba(217, 4, 43, 0.18)',
			panel: '#FFE6EB',
			text: '#111111'
		}
	};

	/**
	 * @typedef {Object} Props
	 * @property {string} title
	 * @property {string} [subtitle]
	 * @property {string} description
	 * @property {string} image
	 * @property {string} [icon]
	 * @property {'gold' | 'green' | 'red'} [accent]
	 * @property {string} [imagePosition]
	 * @property {string} [contentOverlap]
	 * @property {string} [contentLift]
	 * @property {boolean} [reverse]
	 */

	/** @type {Props} */
	let {
		title,
		subtitle = '',
		description,
		image,
		icon = '',
		accent = 'gold',
		imagePosition = '50% 50%',
		contentOverlap = '6.25rem',
		contentLift = '2rem',
		reverse = false
	} = $props();

	const theme = $derived(ACCENTS[accent] ?? ACCENTS.gold);
	const styleVars = $derived(
		`--pillar-accent:${theme.accent}; --pillar-wash:${theme.wash}; --pillar-panel:${theme.panel}; --pillar-text:${theme.text}; --pillar-image-position:${imagePosition}; --pillar-content-overlap:${contentOverlap}; --pillar-content-lift:${contentLift};`
	);
</script>

<article data-no-reveal class:reverse class="pillar-card" style={styleVars}>
	<div class="pillar-grid">
		<figure class="pillar-media">
			<div class="pillar-media-plaque" aria-hidden="true">
				<span>{icon || 'DJ'}</span>
				<p>{title}</p>
			</div>
			<div class="pillar-media-tint" aria-hidden="true"></div>
			<div class="pillar-media-edge" aria-hidden="true"></div>
			<img src={image} alt={title} loading="lazy" decoding="async" />
			<figcaption class="pillar-media-caption">DiasporaJunxion / Ghana</figcaption>
		</figure>

		<div class="pillar-content">
			<div class="pillar-content-head">
				<p class="pillar-kicker">
					{#if icon}
						<span>{icon}</span>
					{/if}
					Core pillar
				</p>
				<div class="pillar-rule" aria-hidden="true"></div>
			</div>
			<h3>{title}</h3>
			{#if subtitle}
				<p class="pillar-subtitle">{subtitle}</p>
			{/if}
			<p class="pillar-description">{description}</p>
		</div>
	</div>
</article>

<style>
	.pillar-card {
		position: relative;
		width: 100%;
		padding: 0.4rem 0;
		min-height: clamp(24rem, 34vw, 30rem);
		overflow: visible;
	}

	.pillar-grid {
		position: relative;
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		align-items: stretch;
		min-height: inherit;
	}

	.pillar-media {
		position: relative;
		grid-column: 1 / span 9;
		margin: 0;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		align-self: stretch;
		border-radius: 2.25rem;
		overflow: hidden;
		background: #0f0f0f;
		box-shadow:
			0 34px 78px rgba(0, 0, 0, 0.34),
			0 0 0 1px rgba(255, 255, 255, 0.06);
	}

	.pillar-card.reverse .pillar-media {
		grid-column: 4 / -1;
	}

	.pillar-media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: var(--pillar-image-position);
		transform: scale(1.01);
		filter: saturate(1.04) contrast(1.03);
		transition: transform 280ms ease;
	}

	.pillar-media-tint {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.2)),
			linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 42%),
			radial-gradient(circle at top left, var(--pillar-wash), transparent 42%);
		z-index: 1;
		pointer-events: none;
	}

	.pillar-media-plaque {
		position: absolute;
		top: 1.15rem;
		left: 1.15rem;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem 0.8rem;
		border-radius: 999px;
		background: rgba(17, 17, 17, 0.68);
		backdrop-filter: blur(12px);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
		color: white;
	}

	.pillar-media-plaque span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--pillar-accent) 82%, white);
		color: #111111;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.pillar-media-plaque p {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.pillar-media-edge {
		position: absolute;
		inset: auto auto 1.15rem 1.15rem;
		width: 7rem;
		height: 0.8rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--pillar-accent) 82%, white);
		z-index: 1;
		pointer-events: none;
	}

	.pillar-media-caption {
		position: absolute;
		right: 1.2rem;
		bottom: 1.15rem;
		z-index: 2;
		margin: 0;
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(12px);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.84);
	}

	.pillar-content {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		width: min(31rem, 46%);
		padding: clamp(1.85rem, 3vw, 2.7rem);
		border-radius: 2.1rem;
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--pillar-panel) 97%, white), var(--pillar-panel));
		box-shadow:
			0 34px 72px rgba(0, 0, 0, 0.24),
			inset 0 1px 0 rgba(255, 255, 255, 0.6),
			0 0 0 1px rgba(17, 17, 17, 0.04);
		color: var(--pillar-text);
		transform: translateY(var(--pillar-content-lift)) translateX(calc(var(--pillar-content-overlap) * -0.2));
		transition:
			transform 280ms ease,
			box-shadow 280ms ease;
	}

	.pillar-content::before {
		content: '';
		position: absolute;
		inset: 1.1rem auto 1.1rem -1.05rem;
		width: 0.55rem;
		border-radius: 999px;
		background: linear-gradient(180deg, var(--pillar-accent), color-mix(in srgb, var(--pillar-accent) 72%, white));
		z-index: -1;
	}

	.pillar-card.reverse .pillar-content {
		left: 0;
		right: auto;
		transform: translateY(var(--pillar-content-lift)) translateX(calc(var(--pillar-content-overlap) * 0.2));
	}

	.pillar-card.reverse .pillar-content::before {
		inset: 1.1rem -1.05rem 1.1rem auto;
	}

	.pillar-card:hover .pillar-media img {
		transform: scale(1.04);
	}

	.pillar-card:hover .pillar-content {
		transform: translateY(calc(var(--pillar-content-lift) - 0.3rem))
			translateX(calc(var(--pillar-content-overlap) * -0.2));
		box-shadow:
			0 38px 78px rgba(0, 0, 0, 0.26),
			inset 0 1px 0 rgba(255, 255, 255, 0.6),
			0 0 0 1px rgba(17, 17, 17, 0.05);
	}

	.pillar-card.reverse:hover .pillar-content {
		transform: translateY(calc(var(--pillar-content-lift) - 0.3rem))
			translateX(calc(var(--pillar-content-overlap) * 0.2));
	}

	.pillar-content-head {
		display: grid;
		gap: 0.9rem;
	}

	.pillar-kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.62);
	}

	.pillar-kicker span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2.75rem;
		height: 2.1rem;
		padding: 0 0.7rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--pillar-accent) 16%, white);
		color: var(--pillar-accent);
	}

	.pillar-rule {
		width: min(100%, 8rem);
		height: 1px;
		background: linear-gradient(90deg, rgba(17, 17, 17, 0.28), transparent);
	}

	.pillar-content h3 {
		margin: 1.15rem 0 0;
		font-size: clamp(2rem, 3vw, 3.4rem);
		line-height: 0.92;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}

	.pillar-subtitle {
		margin: 1rem 0 0;
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.65;
		color: var(--pillar-accent);
	}

	.pillar-description {
		margin: 1rem 0 0;
		font-size: clamp(1rem, 1.35vw, 1.12rem);
		line-height: 1.82;
		color: rgba(17, 17, 17, 0.78);
	}

	@media (max-width: 960px) {
		.pillar-card {
			min-height: auto;
		}

		.pillar-media,
		.pillar-card.reverse .pillar-media,
		.pillar-content,
		.pillar-card.reverse .pillar-content {
			grid-column: 1 / -1;
		}

		.pillar-content,
		.pillar-card.reverse .pillar-content {
			position: relative;
			left: auto;
			right: auto;
			bottom: auto;
			width: auto;
			margin-top: -3rem;
			max-width: none;
			transform: none;
		}

		.pillar-content::before,
		.pillar-card.reverse .pillar-content::before {
			inset: auto 1rem -0.9rem;
			width: auto;
			height: 0.8rem;
			border-radius: 999px;
		}
	}

	@media (max-width: 768px) {
		.pillar-media {
			border-radius: 1.5rem;
		}

		.pillar-content {
			padding: 1.45rem 1.2rem 1.6rem;
			border-radius: 1.45rem;
		}

		.pillar-content h3 {
			font-size: clamp(1.8rem, 8vw, 2.5rem);
		}

		.pillar-description {
			font-size: 0.98rem;
			line-height: 1.72;
		}

		.pillar-media-plaque {
			top: 0.9rem;
			left: 0.9rem;
		}

		.pillar-media-caption {
			right: 0.9rem;
			bottom: 0.9rem;
		}
	}
</style>
