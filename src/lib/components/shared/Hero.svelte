<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { autoReveal } from '$lib/motion/reveal';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/components/shared/Hero.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {string} [subtitle]
	 * @property {string} [description]
	 * @property {string} desktopVideoSrc
	 * @property {string} desktopPosterSrc
	 * @property {string} mobileVideoSrc
	 * @property {string} mobilePosterSrc
	 * @property {'cinematic' | 'brand'} [variant]
	 * @property {import('svelte').Snippet} [logo]
	 * @property {import('svelte').Snippet} [title]
	 * @property {import('svelte').Snippet} [cta]
	 */

	/** @type {Props} */
	let {
		subtitle = 'A bridge for diaspora relocation, belonging, and opportunity in Ghana.',
		description = '',
		desktopVideoSrc,
		desktopPosterSrc,
		mobileVideoSrc,
		mobilePosterSrc,
		variant = 'cinematic',
		logo,
		title,
		cta
	} = $props();

	let videoSrc = $state('');
	let posterSrc = $state('');
	let showLogo = $state(false);

	function updateDevice() {
		if (!browser) return;

		const isMobileViewport = window.innerWidth <= 768;
		showLogo = variant === 'brand' || isMobileViewport;
		videoSrc = isMobileViewport ? mobileVideoSrc : desktopVideoSrc;
		posterSrc = isMobileViewport ? mobilePosterSrc : desktopPosterSrc;
	}

	onMount(() => {
		if (!browser) return;

		updateDevice();
		window.addEventListener('resize', updateDevice);

		return () => window.removeEventListener('resize', updateDevice);
	});
</script>

<section
	data-no-reveal
	class:brand-variant={variant === 'brand'}
	class="hero-shell"
	aria-label="DiasporaJunxion introduction"
>
	<div class="hero-media" aria-hidden="true">
		<video
			class="hero-video"
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
			poster={posterSrc}
		>
			{#if videoSrc}
				<source src={videoSrc} type="video/mp4" />
			{/if}
		</video>
	</div>

	<div class="hero-overlay hero-overlay-base"></div>
	<div class="hero-overlay hero-overlay-depth"></div>
	<div class="hero-overlay hero-overlay-brand"></div>

	<div class="hero-frame">
		<div class="hero-grid">
			<div
				use:autoReveal={{ stagger: 110, threshold: 0.05 }}
				data-reveal-group
				class="hero-copy"
			>
				{#if showLogo}
					<div class="hero-logo" data-reveal-item>
						{@render logo?.()}
					</div>
				{/if}

				{#if subtitle}
					<p class="hero-subtitle" data-reveal-item>{subtitle}</p>
				{/if}

				<div class="hero-title-slot" data-reveal-item>
					{@render title?.()}
				</div>

				{#if description}
					<div class="hero-description" data-reveal-item>
						{@html description}
					</div>
				{/if}

				{#if cta}
					<div class="hero-actions" data-reveal-item>
						{@render cta?.()}
					</div>
				{/if}
			</div>

			{#if variant === 'brand'}
				<aside class="hero-side-panel" aria-hidden="true">
					<div class="hero-side-surface">
						<p class="hero-side-kicker">Grounded Entry</p>
						<p class="hero-side-title">Clarity before relocation. Belonging before performance.</p>
						<ul class="hero-side-list">
							<li>Relocation reality</li>
							<li>Local connection</li>
							<li>Long-view participation</li>
						</ul>
					</div>
				</aside>
			{/if}
		</div>
	</div>
</section>

<style>
	.hero-shell {
		position: relative;
		isolation: isolate;
		display: flex;
		min-height: 100dvh;
		width: 100%;
		align-items: stretch;
		overflow: hidden;
		background: #0b0b0b;
		color: white;
	}

	.hero-media,
	.hero-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.hero-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.hero-overlay-base {
		background:
			linear-gradient(
				180deg,
				rgba(5, 5, 5, 0.12) 0%,
				rgba(5, 5, 5, 0.34) 30%,
				rgba(5, 5, 5, 0.82) 100%
			);
	}

	.hero-overlay-depth {
		background:
			radial-gradient(circle at top right, rgba(242, 183, 5, 0.15), transparent 30rem),
			radial-gradient(circle at left center, rgba(3, 140, 37, 0.1), transparent 26rem);
	}

	.hero-overlay-brand {
		display: none;
	}

	.hero-frame {
		position: relative;
		z-index: 1;
		display: flex;
		width: 100%;
		align-items: flex-end;
		padding: clamp(5rem, 8vw, 7rem) 1.5rem 2rem;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		width: min(100%, 80rem);
		margin: 0 auto;
	}

	.hero-copy {
		max-width: 46rem;
		text-align: center;
	}

	.hero-logo {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.hero-subtitle {
		margin: 0 0 1rem;
		max-width: 35rem;
		margin-inline: auto;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1.6;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.9);
	}

	.hero-title-slot {
		max-width: 46rem;
		margin-inline: auto;
	}

	.hero-description {
		margin-top: 1.45rem;
		max-width: 40rem;
		margin-inline: auto;
		font-size: clamp(1rem, 1.3vw, 1.16rem);
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.84);
	}

	.hero-actions {
		margin-top: 1.9rem;
		display: flex;
		justify-content: center;
	}

	.hero-title-slot :global(h1) {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.85rem, 7vw, 6.1rem);
		font-weight: 900;
		line-height: 0.92;
		letter-spacing: -0.055em;
		text-wrap: balance;
		color: white;
	}

	.hero-title-slot :global(.highlight),
	.hero-title-slot :global(.hero-word-gold) {
		color: #f2b705;
	}

	.hero-title-slot :global(.hero-word-dark) {
		color: #111111;
	}

	.hero-description :global(strong),
	.hero-description :global(.brand-strong) {
		color: white;
		font-weight: 700;
	}

	.hero-description :global(.brand-gold) {
		color: #f2b705;
		font-weight: 700;
	}

	.hero-description :global(em) {
		color: #f2b705;
		font-style: italic;
	}

	.brand-variant {
		background:
			linear-gradient(180deg, #f8f2df 0%, #f3ead2 100%);
		color: #111111;
	}

	.brand-variant .hero-overlay-base {
		background:
			linear-gradient(
				90deg,
				rgba(248, 242, 223, 0.92) 0%,
				rgba(248, 242, 223, 0.74) 34%,
				rgba(248, 242, 223, 0.18) 65%,
				rgba(17, 17, 17, 0.12) 100%
			);
	}

	.brand-variant .hero-overlay-depth {
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.24), transparent 28rem),
			radial-gradient(circle at bottom left, rgba(3, 140, 37, 0.14), transparent 24rem);
	}

	.brand-variant .hero-overlay-brand {
		display: block;
		background:
			linear-gradient(180deg, rgba(248, 242, 223, 0.1), rgba(248, 242, 223, 0.22)),
			linear-gradient(135deg, rgba(217, 4, 43, 0.08), transparent 38%);
	}

	.brand-variant .hero-frame {
		align-items: center;
		padding-block: clamp(4.75rem, 7vw, 6rem);
	}

	.brand-variant .hero-grid {
		grid-template-columns: minmax(0, 1.02fr) minmax(18rem, 0.54fr);
		align-items: end;
		gap: clamp(1.5rem, 4vw, 4rem);
	}

	.brand-variant .hero-copy {
		max-width: 46rem;
		padding: clamp(1.4rem, 3vw, 2rem);
		border-radius: 2rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.18)),
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.16), transparent 60%);
		backdrop-filter: blur(12px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.34),
			0 30px 70px rgba(121, 86, 11, 0.12);
		text-align: left;
	}

	.brand-variant .hero-logo {
		justify-content: flex-start;
	}

	.brand-variant .hero-subtitle,
	.brand-variant .hero-title-slot,
	.brand-variant .hero-description {
		margin-inline: 0;
		max-width: 40rem;
	}

	.brand-variant .hero-subtitle {
		color: rgba(17, 17, 17, 0.72);
	}

	.brand-variant .hero-title-slot :global(h1) {
		color: #111111;
	}

	.brand-variant .hero-description {
		color: rgba(17, 17, 17, 0.8);
	}

	.brand-variant .hero-description :global(strong),
	.brand-variant .hero-description :global(.brand-strong) {
		color: #111111;
	}

	.brand-variant .hero-actions {
		justify-content: flex-start;
	}

	.hero-side-panel {
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
	}

	.hero-side-surface {
		width: min(100%, 21rem);
		padding: 1.4rem 1.4rem 1.55rem;
		border-radius: 1.8rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.16), transparent 58%),
			linear-gradient(180deg, rgba(17, 17, 17, 0.94), rgba(27, 27, 27, 0.98));
		box-shadow: 0 28px 56px rgba(0, 0, 0, 0.2);
		color: white;
	}

	.hero-side-kicker {
		margin: 0 0 0.85rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.76);
	}

	.hero-side-title {
		margin: 0;
		font-size: 1.08rem;
		font-weight: 700;
		line-height: 1.52;
		letter-spacing: -0.01em;
		color: white;
	}

	.hero-side-list {
		list-style: none;
		display: grid;
		gap: 0.65rem;
		margin: 1.2rem 0 0;
		padding: 0;
	}

	.hero-side-list li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.92rem;
		color: rgba(255, 255, 255, 0.84);
	}

	.hero-side-list li::before {
		content: '';
		display: inline-block;
		width: 0.52rem;
		height: 0.52rem;
		border-radius: 999px;
		background: #f2b705;
		box-shadow: 0 0 0 0.28rem rgba(242, 183, 5, 0.16);
	}

	@media (max-width: 960px) {
		.brand-variant .hero-grid,
		.hero-grid {
			grid-template-columns: 1fr;
		}

		.hero-side-panel {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.hero-frame {
			padding-inline: 1rem;
			padding-top: 6rem;
		}

		.hero-copy {
			text-align: center;
		}

		.hero-logo {
			justify-content: center;
		}

		.hero-subtitle,
		.hero-title-slot,
		.hero-description {
			margin-inline: auto;
		}

		.hero-actions {
			justify-content: center;
		}

		.hero-title-slot :global(h1) {
			line-height: 0.98;
			letter-spacing: -0.04em;
		}

		.brand-variant .hero-copy {
			text-align: center;
			padding: 1.25rem;
		}

		.brand-variant .hero-logo {
			justify-content: center;
		}

		.brand-variant .hero-subtitle,
		.brand-variant .hero-title-slot,
		.brand-variant .hero-description {
			margin-inline: auto;
		}

		.brand-variant .hero-actions {
			justify-content: center;
		}
	}
</style>
