<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Footer from '$lib/layout/Footer.svelte';

	const cards = [
		{
			title: 'Connection',
			description: 'A hub for collaboration.',
			icon: '🔗',
			image: '/images/connection.jpeg'
		},
		{
			title: 'Innovation',
			description: 'Bold ideas reshaping Africa.',
			icon: '💡',
			image: '/images/innovation.jpeg'
		},
		{
			title: 'Culture',
			description: 'Amplifying what makes us unstoppable.',
			icon: '🎶',
			image: '/images/culture.jpeg'
		},
		{
			title: 'Impact',
			description: 'Turning hustle into movement.',
			icon: '🌍',
			image: '/images/impact.jpeg'
		}
	];

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const cardEls = document.querySelectorAll('.card');

		cardEls.forEach((card, i) => {
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
	});
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="landing-page font-sans bg-black text-white">
	<!-- Hero Section -->
	<section class="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
		<div class="absolute inset-0 bg-gradient-to-b from-black/60 to-black"></div>

		<div class="relative z-10 max-w-5xl mx-auto">
			<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
				Diaspora<span class="text-[#D9042B]">Junxion</span>
			</h1>

			<h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-8 text-gray-200">
				The Junction of <span class="font-semibold">Diaspora Power</span> and
				<span class="font-semibold">African Innovation</span>
			</h2>

			<p class="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-10 text-gray-300">
				<span class="font-bold">Diaspora</span> is more than a word — it’s a people.<br />
				Africans at home and abroad, carrying the roots of the continent into every corner of the world.<br
				/>
				From music, to style, to tech, to culture — the Diaspora is Africa in motion.
			</p>
		</div>
	</section>

	<!-- About DiasporaJunxion -->
	<section class="py-16 px-6 sm:py-20 bg-gradient-to-b from-black to-gray-900 text-center">
		<div class="max-w-4xl mx-auto">
			<h3 class="text-2xl sm:text-3xl font-bold mb-6">What is DiasporaJunxion?</h3>
			<p class="text-base sm:text-lg mb-4 sm:mb-6">
				In Ghana, when you say <span class="font-semibold">“Diaspora”</span>, you mean the ones
				coming back — brothers and sisters from the States, from Europe, from everywhere Africans
				have built a life. People carrying new energy, new ideas, and new resources.
			</p>
			<p class="text-base sm:text-lg mb-4 sm:mb-6">
				But <span class="font-semibold">Diaspora</span> is also bigger. It’s the name for Africans everywhere
				— from the descendants of the slave trade to the returnees landing in Accra today.
			</p>
			<p class="text-base sm:text-lg">
				<span class="font-bold">DiasporaJunxion</span> is where these meanings come together. A junction
				where returnees meet locals, where Africans abroad connect with home, where culture, business,
				and vision flow both ways.
			</p>
		</div>
	</section>

	<!-- Cards Section -->
	<section class="py-16 sm:py-20 px-6 max-w-6xl mx-auto">
		{#each cards as card, i}
			<div
				class="card flex flex-col md:flex-row items-center mb-12 sm:mb-16 gap-6 sm:gap-8 {i % 2 ===
				0
					? 'even'
					: 'odd'}"
			>
				<div class="card-image w-full md:w-1/2">
					<img src={card.image} alt={card.title} />
				</div>
				<div class="card-text w-full md:w-1/2 text-center md:text-left">
					<div class="text-3xl sm:text-4xl mb-3 sm:mb-4">{card.icon}</div>
					<h3 class="text-xl sm:text-2xl md:text-2xl font-bold mb-2">{card.title}</h3>
					<p class="text-sm sm:text-base md:text-lg text-gray-300">{card.description}</p>
				</div>
			</div>
		{/each}
	</section>

	<!-- Call to Action -->
	<section class="py-16 sm:py-20 px-6 text-center">
		<div class="max-w-3xl mx-auto">
			<h3 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Join the Movement</h3>
			<p class="text-base sm:text-lg mb-8 sm:mb-10">
				DiasporaJunxion is just getting started. Be part of the first wave shaping the story.
			</p>
			<button class="cta-btn">Get Involved</button>
		</div>
	</section>
	<Footer />
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

	img {
		width: 100%;
		border-radius: 1rem;
		height: auto;
	}

	.card {
		padding: 1.5rem 1rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
	}
	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
	}

	.cta-btn {
		background: #d9042b;
		color: #fff;
		font-weight: 700;
		font-size: 1rem;
		padding: 0.85rem 2rem;
		border-radius: 9999px;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease,
			background 0.25s ease;
	}
	.cta-btn:hover {
		background: #b50323;
		transform: scale(1.05);
		box-shadow: 0 8px 24px rgba(217, 4, 43, 0.4);
	}

	/* Alternating layout for md screens */
	.card.even {
		flex-direction: row;
	}
	.card.odd {
		flex-direction: row-reverse;
	}

	@media (max-width: 768px) {
		.card {
			flex-direction: column;
			text-align: center;
		}
		.card-image,
		.card-text {
			width: 100%;
		}
		.card-text {
			margin-top: 1rem;
		}
	}
</style>
