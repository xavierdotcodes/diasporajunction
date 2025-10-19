<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import CTASection from '$lib/landing/CTASection.svelte';

	const cards = [
		{
			title: 'Connection',
			description:
				'We’re building real bridges — not just flights — between diaspora travelers and the Ghanaian creative scene.',
			icon: '🔗',
			image: '/images/landing/connection.webp'
		},
		{
			title: 'Innovation',
			description:
				'Africa’s new ideas meet global skillsets. We incubate creative projects that move culture and commerce forward.',
			icon: '💡',
			image: '/images/landing/innovation.webp'
		},
		{
			title: 'Culture',
			description:
				'We amplify the heartbeat of Ghana — nightlife, art, food, and rhythm — and connect it with the world.',
			icon: '🎶',
			image: '/images/landing/culture.webp'
		},
		{
			title: 'Collaboration',
			description:
				'From designers to DJs, coders to curators — DiasporaJunxion is a meeting ground for ideas and partnerships.',
			icon: '🫱🏾‍🫲🏽',
			image: '/images/landing/collaboration.webp'
		},
		{
			title: 'Impact',
			description:
				'Every project supports local makers, artisans, and entrepreneurs. When we grow, communities grow.',
			icon: '🌍',
			image: '/images/landing/impact1.webp'
		}
	];

	let heroVideoSrc;

	onMount(async () => {
		// Set video source based on viewport width
		heroVideoSrc =
			window.innerWidth <= 768
				? '/videos/mobile_landing-hero.mp4'
				: '/videos/desktop_landing-hero.mp4';

		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Animate hero letters
		gsap.from('.hero-title span', {
			y: 40,
			opacity: 0,
			stagger: 0.1,
			duration: 1.2,
			ease: 'power4.out'
		});

		// Fade in video background
		gsap.from('video', { opacity: 0, duration: 1.5, ease: 'power2.out' });

		// Card scroll animations
		document.querySelectorAll('.card').forEach((card, i) => {
			const text = card.querySelector('.card-text');
			const img = card.querySelector('.card-image');

			gsap.from(text, {
				x: i % 2 === 0 ? -200 : 200,
				opacity: 0,
				duration: 1.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});

			gsap.from(img, {
				x: i % 2 === 0 ? 200 : -200,
				opacity: 0,
				duration: 1.2,
				delay: 0.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});
		});

		// Approach animations
		gsap.utils.toArray('.approach-card').forEach((card, i) => {
			gsap.from(card, {
				opacity: 0,
				y: 60,
				duration: 1,
				delay: i * 0.15,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});
		});
	});
</script>

<svelte:head>
	<title>DiasporaJunxion | Connecting Diaspora & African Innovation</title>
	<meta
		name="description"
		content="Learn how DiasporaJunxion empowers Ghanaian artists, makers, and entrepreneurs to reach global markets through mentorship, structure, and exposure."
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="landing-page font-sans bg-black text-white">
	<!-- HERO SECTION -->
	<section
		class="relative flex flex-col items-center justify-center min-h-[100dvh] w-full px-6 text-center overflow-hidden"
	>
		<!-- Background video -->
		<div class="absolute inset-0 w-full h-full overflow-hidden">
			<video
				class="w-full h-full object-cover object-center"
				src={heroVideoSrc}
				poster="/images/hero-poster.jpg"
				autoplay
				muted
				loop
				playsinline
				preload="auto"
			></video>
		</div>

		<!-- Overlay gradient -->
		<div class="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>

		<!-- Hero content -->
		<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
			<h1
				class="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
			>
				{#each 'Diaspora'.split('') as letter}
					<span>{letter}</span>
				{/each}
				<span class="text-[#D9042B]">
					{#each 'Junxion'.split('') as letter}
						<span>{letter}</span>
					{/each}
				</span>
			</h1>

			<h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-8 text-gray-200">
				The meeting point of <span class="font-semibold">Diaspora Power</span> and
				<span class="font-semibold">African Innovation</span>
			</h2>

			<p
				class="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-10 text-gray-300 max-w-3xl mx-auto"
			>
				<span class="font-bold text-white">Diaspora</span> is more than a word — it’s a people.<br
				/>
				Africans at home and abroad, carrying the continent’s rhythm into every corner of the world.<br
				/>
				From music to tech, from art to nightlife — we are Africa in motion.<br /><br />
				<span class="text-[#FFBC03] font-semibold">DiasporaJunxion</span> is the bridge — where we return,
				connect, and build the future together.
			</p>

			<a
				href="#about"
				class="inline-block bg-[#038C25] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#026b1d] transition"
			>
				Enter the Junxion
			</a>
		</div>
	</section>

	<!-- The rest of your page stays the same... -->
	<!-- ABOUT, PILLARS, APPROACH, STORY, CTA -->
	<CTASection />
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', sans-serif;
		background-color: #000;
		color: #fff;
	}
	html {
		scroll-behavior: smooth;
	}
	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
	@media (max-width: 640px) {
		.hero-title {
			font-size: 2.5rem;
			line-height: 1.2;
		}
	}
</style>
