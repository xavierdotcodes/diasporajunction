<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let titleParts = [
		{ text: 'Explore', color: '#D9042B' },
		{ text: 'Ghana', color: '#038C25' }
	];
	export let subtitle;

	let section;
	let heroVideoSrc;

	onMount(async () => {
		// Responsive video source
		heroVideoSrc =
			window.innerWidth <= 768 ? '/videos/mobile_tours-hero.mp4' : '/videos/desktop_tours-hero.mp4';

		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Animate title letters
		gsap.from(section.querySelectorAll('h1 span'), {
			duration: 1,
			y: -40,
			opacity: 0,
			stagger: 0.15,
			ease: 'power2.out'
		});

		// Animate subtitle
		gsap.from(section.querySelector('.intro'), {
			duration: 1,
			y: 24,
			opacity: 0,
			delay: 0.4,
			ease: 'power2.out'
		});

		// Parallax + subtle movement on hero video
		const video = section.querySelector('video');
		if (video) {
			gsap.to(video, {
				yPercent: 5,
				scale: 1.05,
				ease: 'power1.inOut',
				scrollTrigger: {
					trigger: section,
					start: 'top top',
					end: 'bottom top',
					scrub: true
				}
			});

			// Fade in video
			gsap.from(video, { opacity: 0, duration: 1.5, ease: 'power2.out' });
		}
	});
</script>

<section
	class="relative tour-hero flex flex-col items-center justify-center text-center px-6 min-h-[60vh]"
	bind:this={section}
>
	<video
		class="absolute hero-video"
		src={heroVideoSrc}
		poster="/images/tours-hero-poster.jpg"
		autoplay
		muted
		loop
		playsinline
		preload="auto"
	></video>

	<div class="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>

	<div class="relative z-10 max-w-3xl px-4 sm:px-6 md:px-8">
		<h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug">
			{#each titleParts as part}
				<span style="color: {part.color}">{part.text} </span>
			{/each}
		</h1>
		<p class="intro text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mt-4">
			{subtitle}
		</p>
	</div>
</section>

<style>
	.tour-hero {
		position: relative;
		width: 100%;
		overflow: hidden;
		scroll-margin-top: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: white;
		min-height: 60vh;
	}

	video.hero-video {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		min-width: 100%;
		min-height: 100%;
		transform: translate(-50%, -50%);
		object-fit: cover;
		object-position: center;
		z-index: 0;
	}

	.tour-hero h1 span {
		text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
		display: inline-block;
	}

	.tour-hero .intro {
		line-height: 1.6;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
	}

	.tour-hero .intro,
	.tour-hero h1 {
		position: relative;
		z-index: 2;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.tour-hero {
			min-height: 400px;
		}
		h1 {
			font-size: 2.5rem;
		}
		.intro {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		.tour-hero {
			min-height: 350px;
		}
		h1 {
			font-size: 2rem;
		}
		.intro {
			font-size: 0.95rem;
		}
	}
</style>
