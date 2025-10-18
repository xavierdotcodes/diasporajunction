<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let section;

	onMount(() => {
		// Animate hero content smoothly
		gsap.from(section.querySelectorAll('.hero-content > *'), {
			y: 60,
			opacity: 0,
			stagger: 0.2,
			duration: 1.2,
			ease: 'power3.out'
		});

		// Fade in hero video
		const video = section.querySelector('video');
		if (video) {
			gsap.from(video, { opacity: 0, duration: 1.5, ease: 'power2.out' });
		}
	});
</script>

<section class="hero" bind:this={section}>
	<!-- Background video -->
	<video class="hero-video" autoplay muted loop playsinline poster="/images/du_field-poster.jpg">
		<source src="/videos/football-hero.mp4" type="video/mp4" />
	</video>

	<!-- Overlay gradient -->
	<div class="hero-overlay"></div>

	<!-- Hero content -->
	<div class="hero-content">
		<img src="/images/logos/DiasporaU-optimized.png" alt="DiasporaUnited Logo" class="hero-logo" />
		<h1>Diaspora United F.C.</h1>
		<p>
			The first Diaspora-owned football club in Ghana.<br />
			Where culture meets competition.
		</p>
	</div>
</section>

<style>
	.hero {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: white;
		overflow: hidden;
	}

	.hero-video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4); /* Slight dark overlay for readability */
		z-index: 1;
	}

	.hero-content {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.hero-logo {
		width: clamp(200px, 30vw, 320px);
		max-width: 100%;
		margin-bottom: 2rem;
		transition: transform 0.3s ease;
	}

	.hero-logo:hover {
		transform: scale(1.05);
	}

	h1 {
		font-family: 'Archivo Black', sans-serif;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 1.2rem;
		font-size: clamp(2.2rem, 4.5vw, 3.8rem);
	}

	p {
		max-width: 700px;
		line-height: 1.6;
		font-size: clamp(1.05rem, 1.5vw, 1.25rem);
		color: #ddd;
	}
</style>
