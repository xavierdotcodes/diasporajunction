<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let titleParts = [
		{ text: 'Explore', color: '#D9042B' },
		{ text: 'Ghana', color: '#038C25' }
	];
	export let subtitle;

	onMount(() => {
		gsap.from('.tour-hero h1 span', {
			duration: 1,
			y: -40,
			opacity: 0,
			stagger: 0.15,
			ease: 'power2.out'
		});
		gsap.from('.tour-hero .intro', {
			duration: 1,
			y: 24,
			opacity: 0,
			delay: 0.4,
			ease: 'power2.out'
		});

		gsap.to('.tour-hero video', {
			yPercent: 5,
			scale: 1.05,
			ease: 'power1.inOut',
			scrollTrigger: {
				trigger: '.tour-hero',
				start: 'top top',
				end: 'bottom top',
				scrub: true
			}
		});
	});
</script>

<section
	class="relative tour-hero min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
>
	<!-- Background video -->
	<video
		class="absolute inset-0 w-full h-full object-cover"
		src="/videos/tours-hero.mp4"
		poster="/images/tour-hero-poster.jpg"
		autoplay
		muted
		loop
		playsinline
	></video>

	<!-- Gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>

	<!-- Hero content -->
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
		overflow: hidden;
		scroll-margin-top: 100px;
	}

	.tour-hero h1 span {
		text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
	}

	.tour-hero .intro {
		line-height: 1.6;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
	}
</style>
