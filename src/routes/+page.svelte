<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	onMount(() => {
		gsap.from('.hero-text', {
			y: 50,
			opacity: 0,
			duration: 1.2,
			stagger: 0.25,
			ease: 'power3.out'
		});
	});
</script>

<svelte:head>
	<!-- Google Font -->
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen bg-black text-white font-sans">
	<!-- Hero Section -->
	<section class="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
		<div class="absolute inset-0 bg-gradient-to-b from-black/60 to-black"></div>

		<div class="relative z-10 max-w-5xl mx-auto">
			<h1
				class="hero-text text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-white"
			>
				Diaspora<span class="text-[#D9042B]">Junxion</span>
			</h1>

			<h2 class="hero-text text-xl sm:text-2xl md:text-3xl font-light mb-10 text-gray-200">
				The Junction of <span class="font-semibold">Diaspora Power</span> and
				<span class="font-semibold">African Innovation</span>
			</h2>

			<p class="hero-text text-lg sm:text-xl md:text-2xl leading-relaxed mb-12 text-gray-300">
				<span class="font-bold">Diaspora</span> is more than a word — it’s a people.<br />
				Africans at home and abroad, carrying the roots of the continent into every corner of the world.<br
				/>
				From music, to style, to tech, to culture — the Diaspora is Africa in motion.
			</p>

			<div class="hero-text grid gap-6 sm:grid-cols-2 md:grid-cols-4 text-sm sm:text-base">
				<div class="card">🔗 <strong>Connection:</strong> A hub for collaboration.</div>
				<div class="card">💡 <strong>Innovation:</strong> Bold ideas reshaping Africa.</div>
				<div class="card">🎶 <strong>Culture:</strong> Amplifying what makes us unstoppable.</div>
				<div class="card">🌍 <strong>Impact:</strong> Turning hustle into movement.</div>
			</div>

			<p class="hero-text text-xl sm:text-2xl md:text-3xl font-medium mt-12 text-[#D9042B]">
				✨ Where Africans Everywhere Come Together.
			</p>
		</div>
	</section>

	<!-- About DiasporaJunxion Section -->
	<section class="py-20 px-6 bg-gradient-to-b from-black to-gray-900 text-center">
		<div class="max-w-4xl mx-auto">
			<h3 class="section-title">What is DiasporaJunxion?</h3>
			<p class="section-text mb-6">
				In Ghana, when you say <span class="font-semibold">“Diaspora”</span>, you mean the ones
				coming back — brothers and sisters from the States, from Europe, from everywhere Africans
				have built a life. People carrying new energy, new ideas, and new resources.
			</p>
			<p class="section-text mb-6">
				But <span class="font-semibold">Diaspora</span> is also bigger. It’s the name for Africans everywhere
				— from the descendants of the slave trade to the returnees landing in Accra today.
			</p>
			<p class="section-text">
				<span class="font-bold">DiasporaJunxion</span> is where these meanings come together. A junction
				where returnees meet locals, where Africans abroad connect with home, where culture, business,
				and vision flow both ways.
			</p>
		</div>
	</section>

	<!-- Call to Action -->
	<section class="py-20 px-6 text-center">
		<div class="max-w-3xl mx-auto">
			<h3 class="section-title mb-6">Join the Movement</h3>
			<p class="section-text mb-10">
				DiasporaJunxion is just getting started. Be part of the first wave shaping the story.
			</p>
			<button class="cta-btn">Get Involved</button>
		</div>
	</section>
</div>

<style>
	/* Global Reset */
	:global(body) {
		margin: 0;
		font-family: 'Inter', sans-serif;
		background-color: #000;
		color: #fff;
	}

	html {
		scroll-behavior: smooth;
	}

	/* Section Headings */
	.section-title {
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
	}

	/* Section Text */
	.section-text {
		font-size: 1.125rem;
		line-height: 1.75rem;
		color: #d1d5db; /* Tailwind gray-300 */
	}

	/* Reusable Card Style */
	.card {
		padding: 1.5rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
	}

	/* CTA Button */
	.cta-btn {
		background: #d9042b;
		color: #fff;
		font-weight: 700;
		font-size: 1.125rem;
		padding: 1rem 2.5rem;
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
</style>
