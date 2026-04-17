<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { autoReveal } from '$lib/motion/reveal';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/ui/Hero.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {string} [subtitle]
	 * @property {string} [description]
	 * @property {string} desktopVideoSrc
	 * @property {string} desktopPosterSrc
	 * @property {string} mobileVideoSrc
	 * @property {string} mobilePosterSrc
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
		showLogo = isMobileViewport;
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
	class="relative isolate flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#0B0B0B] text-white"
>
	<!-- Background Video -->
	<div class="pointer-events-none absolute inset-0">
		<video
			class="h-full w-full object-cover object-center"
			autoplay
			muted
			loop
			playsinline
			poster={posterSrc}
		>
			{#if videoSrc}
				<source src={videoSrc} type="video/mp4" />
			{/if}
		</video>
	</div>

	<!-- Overlay -->
	<div class="pointer-events-none absolute inset-0 bg-black/50"></div>
	<div
		class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,11,0.2),rgba(11,11,11,0.78),rgba(11,11,11,0.94))]"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(242,183,5,0.22),transparent_68%)]"
	></div>
	<div
		class="pointer-events-none absolute inset-y-0 left-0 w-56 bg-[radial-gradient(circle_at_left,rgba(3,140,37,0.12),transparent_70%)]"
	></div>

	<!-- Content -->
	<div
		use:autoReveal={{ stagger: 110, threshold: 0.05 }}
		data-reveal-group
		class="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 text-center sm:px-8 md:px-10 md:py-32"
	>
		{#if showLogo}
			<div class="mb-6 flex justify-center" data-reveal-item>
				{@render logo?.()}
			</div>
		{/if}

		{#if subtitle}
			<p
				data-reveal-item
				class="mb-4 max-w-3xl font-mono text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#F2B705] sm:text-xs"
			>
				{subtitle}
			</p>
		{/if}

		<div class="hero-title-slot max-w-5xl font-heading" data-reveal-item>
			{@render title?.()}
		</div>

		{#if description}
			<div
				data-reveal-item
				class="hero-description mt-6 max-w-3xl text-sm leading-7 text-white/85 sm:text-base md:mt-8 md:text-lg md:leading-8"
			>
				{@html description}
			</div>
		{/if}

		{#if cta}
			<div class="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10" data-reveal-item>
				{@render cta?.()}
			</div>
		{/if}
	</div>
</section>

<style>
	.hero-title-slot :global(h1) {
		font-family: var(--font-heading);
		font-size: clamp(2.75rem, 7vw, 5.75rem);
		font-weight: 900;
		line-height: 0.96;
		letter-spacing: -0.04em;
		text-wrap: balance;
		color: white;
		margin: 0;
	}

	.hero-title-slot :global(.highlight) {
		color: #F2B705;
	}

	.hero-description :global(strong) {
		color: white;
		font-weight: 700;
	}

	.hero-description :global(em) {
		font-style: italic;
		color: #F2B705;
	}

	@media (max-width: 640px) {
		.hero-title-slot :global(h1) {
			line-height: 1;
			letter-spacing: -0.03em;
		}
	}
</style>
