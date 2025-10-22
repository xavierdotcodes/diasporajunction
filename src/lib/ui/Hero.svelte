<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let title = 'DiasporaJunxion';
	export let subtitle = 'The meeting point of Diaspora Power and African Innovation.';
	export let description = '';
	export let desktopVideoSrc;
	export let desktopPosterSrc;
	export let mobileVideoSrc;
	export let mobilePosterSrc;

	let videoSrc = '';
	let posterSrc = '';
	let showLogo = false;

	// Split title into prefix + highlight
	$: titleParts = (() => {
		const idx = title.indexOf('Junxion');
		if (idx !== -1) {
			return {
				prefix: title.slice(0, idx),
				highlight: 'Junxion',
				suffix: title.slice(idx + 'Junxion'.length)
			};
		}
		return { prefix: title, highlight: '', suffix: '' };
	})();

	function updateDevice() {
		if (!browser) return;
		const ua = navigator.userAgent || '';
		const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(
			ua
		);
		showLogo = isMobileUA;
		videoSrc = isMobileUA ? mobileVideoSrc : desktopVideoSrc;
		posterSrc = isMobileUA ? mobilePosterSrc : desktopPosterSrc;
	}

	onMount(() => {
		if (!browser) return;
		updateDevice();
		window.addEventListener('resize', updateDevice);
		return () => window.removeEventListener('resize', updateDevice);
	});
</script>

<section
	class="hero-section relative flex flex-col items-center justify-center text-center font-sans bg-black text-white overflow-hidden"
>
	<!-- Background Video -->
	<div class="absolute inset-0 w-full h-full pointer-events-none">
		<video
			class="hero-video w-full h-full object-cover object-center"
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
	<div
		class="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 pointer-events-none"
	></div>

	<!-- Content -->
	<div
		class="hero-content relative z-10 flex flex-col items-center justify-center max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-6"
	>
		{#if showLogo}
			<div class="logo">
				<slot name="logo" />
			</div>
		{/if}

		<h1 class="hero-title font-extrabold tracking-tight leading-tight text-white">
			<span class="text-white">{titleParts.prefix}</span><span class="text-[#D9042B]"
				>{titleParts.highlight}</span
			><span class="text-white">{titleParts.suffix}</span>
		</h1>

		{#if subtitle}
			<h2 class="hero-subtitle font-light text-white max-w-3xl">{subtitle}</h2>
		{/if}

		{#if description}
			<p class="hero-description text-white max-w-3xl">
				{@html description}
			</p>
		{/if}

		<slot name="cta" />
	</div>
</section>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		width: 100%;
		max-width: 100vw;
		overflow-x: hidden;
		font-family: 'Inter', sans-serif;
		background-color: #000;
		color: #fff;
		scroll-behavior: smooth;
	}

	.hero-section {
		position: relative;
		width: 100%;
		max-width: 100vw;
		min-height: 100dvh;
		overflow: hidden;
	}

	video.hero-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.hero-title {
		font-size: 5rem;
		line-height: 1.1;
		word-break: break-word;
		color: #fff;
	}

	.hero-subtitle {
		font-size: 1.75rem;
		color: #ffffff;
	}

	.hero-description {
		font-size: 1.125rem;
		line-height: 1.6;
		color: #ffffff;
	}

	/* Mobile Portrait */
	@media (max-width: 480px) and (orientation: portrait) {
		.hero-title {
			font-size: 2.4rem;
		}
		.hero-subtitle {
			font-size: 1rem;
		}
		.hero-description {
			font-size: 0.95rem;
			line-height: 1.45;
			margin-bottom: 1.5rem;
		}
		video.hero-video {
			object-position: top center;
		}
		.hero-content {
			padding-left: 1rem;
			padding-right: 1rem;
		}
	}

	/* Mobile Landscape */
	@media (max-height: 480px) and (orientation: landscape) {
		.hero-title {
			font-size: 2.2rem;
			margin-bottom: 0.5rem;
			white-space: normal;
		}
		.hero-subtitle {
			font-size: 0.95rem;
			line-height: 1.2;
		}
		.hero-description {
			display: none;
		}
		video.hero-video {
			object-position: center center;
		}
		.hero-content {
			max-width: 100%;
			padding: 0;
			margin: 0 auto;
		}
	}

	/* Tablet */
	@media (min-width: 481px) and (max-width: 1024px) {
		.hero-title {
			font-size: 3.5rem;
		}
		.hero-subtitle {
			font-size: 1.25rem;
		}
		.hero-description {
			font-size: 1rem;
			max-width: 600px;
		}
		video.hero-video {
			object-position: center 20%;
		}
		.hero-content {
			padding: 0 2rem;
		}
	}

	/* Desktop */
	@media (min-width: 1025px) {
		.hero-title {
			font-size: 5rem;
		}
		.hero-subtitle {
			font-size: 1.75rem;
		}
		.hero-description {
			font-size: 1.125rem;
		}
		video.hero-video {
			object-position: center center;
		}
	}
</style>
