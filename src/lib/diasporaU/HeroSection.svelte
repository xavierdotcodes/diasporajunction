<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let section;

	onMount(() => {
		// Split title letters into spans for animation
		const title = section.querySelector('h1');
		title.innerHTML = title.textContent.replace(/(\S+)/g, '<span>$1</span>');

		// Animate hero content elements
		gsap.from(section.querySelectorAll('.hero-content span, .hero-content p, .hero-logo'), {
			y: 60,
			opacity: 0,
			stagger: 0.1,
			duration: 1.2,
			ease: 'power3.out'
		});

		// Fade in hero video
		const video = section.querySelector('video');
		if (video) {
			gsap.from(video, { opacity: 0, duration: 1.5, ease: 'power2.out' });
		}

		// Subtle logo bounce
		const logo = section.querySelector('.hero-logo');
		if (logo) {
			gsap.fromTo(
				logo,
				{ scale: 0.95 },
				{ scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)', delay: 0.5 }
			);
		}
	});
</script>

<section class="hero" bind:this={section}>
	<video class="hero-video" autoplay muted loop playsinline poster="/images/du_field-poster.jpg">
		<source src="/videos/diasporau-hero.mp4" type="video/mp4" />
	</video>

	<div class="hero-overlay"></div>

	<div class="hero-content">
		<img src="/images/logos/DiasporaU-optimized.png" alt="DiasporaUnited Logo" class="hero-logo" />
		<h1>
			<span class="text-white">Diaspora</span> <span class="text-[#D9042B]">United</span> F.C.
		</h1>
		<p>
			The first Diaspora-owned football club in Ghana.<br />
			Where <span class="text-[#FFBC03] font-semibold">culture</span> meets
			<span class="text-[#D9042B] font-semibold">competition</span>.
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
		background: rgba(0, 0, 0, 0.4);
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
	}

	h1 {
		font-family: 'Archivo Black', sans-serif;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 1.2rem;
		font-size: clamp(2.2rem, 4.5vw, 3.8rem);
	}

	h1 span {
		display: inline-block;
	}

	p {
		max-width: 700px;
		line-height: 1.6;
		font-size: clamp(1.05rem, 1.5vw, 1.25rem);
		color: #ddd;
	}

	p span {
		font-weight: 600;
	}
</style>
