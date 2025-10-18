<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Section fade-in animations
		gsap.utils.toArray('.fade-section').forEach((section) => {
			gsap.from(section, {
				opacity: 0,
				y: 50,
				duration: 1,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: section,
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				}
			});
		});

		// Animate each process card
		gsap.utils.toArray('.process-card').forEach((card, i) => {
			gsap.from(card, {
				opacity: 0,
				y: 60,
				duration: 1,
				delay: i * 0.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});
		});

		// Optional: subtle parallax on hero video
		gsap.to('.hero-video', {
			yPercent: 10,
			scale: 1.05,
			ease: 'power1.inOut',
			scrollTrigger: {
				trigger: '.hero-section',
				start: 'top top',
				end: 'bottom top',
				scrub: true
			}
		});
	});
</script>

<svelte:head>
	<title>Our Approach | DiasporaJunxion</title>
	<meta
		name="description"
		content="Learn how DiasporaJunxion empowers Ghanaian artists, makers, and entrepreneurs to reach global markets through mentorship, structure, and exposure."
	/>
</svelte:head>

<div class="approach-page font-sans bg-white text-black">
	<!-- HERO -->
	<section
		class="relative min-h-[60vh] flex flex-col items-center justify-center text-center hero-section px-6"
	>
		<!-- Background video -->
		<video
			class="absolute inset-0 w-full h-full object-cover hero-video"
			src="/videos/approach-hero.mp4"
			poster="/images/approach-poster.jpg"
			autoplay
			muted
			loop
			playsinline
		></video>

		<!-- Underlay gradient for contrast -->
		<div class="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>

		<!-- Hero content -->
		<div class="relative z-10 max-w-3xl px-4 sm:px-6 md:px-8">
			<h1 class="text-5xl sm:text-6xl font-extrabold mb-4 text-white">
				Our <span class="text-[#D9042B]">Approach</span>
			</h1>
			<p class="text-lg sm:text-xl text-gray-200 leading-relaxed">
				How we turn Ghanaian creativity into globally viable ventures — through mentorship,
				structure, and exposure.
			</p>
		</div>
	</section>
	<!-- WHAT WE DO -->
	<section class="fade-section py-20 px-8 text-center bg-white">
		<h2 class="text-3xl font-bold text-[#038C25] mb-4">What We Do</h2>
		<p class="max-w-4xl mx-auto text-gray-700 leading-relaxed text-lg">
			DiasporaJunxion discovers and supports Ghanaian artists, makers, and entrepreneurs with
			world-class potential. Through our accelerator and incubation programs, we help creators
			refine their projects, products, and services to meet global standards. We strengthen the
			ecosystems they grow from by expanding access to mentorship, capital, and exposure for the
			next generation of African innovators.
		</p>
	</section>

	<!-- HOW WE DO IT -->
	<section class="fade-section py-20 bg-[#f9f9f9] px-8 text-center">
		<h2 class="text-3xl font-bold text-[#FFBC03] mb-10">How We Do It</h2>

		<div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-left">
			<div class="process-card p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
				<div class="text-4xl mb-4">⚙️</div>
				<h3 class="text-xl font-semibold text-[#038C25] mb-3">1. Development</h3>
				<p class="text-gray-700 leading-relaxed">
					We guide creators to refine their craft or venture — aligning their product, art, or
					service with global standards. Through mentorship, funding, and structure, we help them
					evolve from concept to readiness.
				</p>
			</div>

			<div class="process-card p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
				<div class="text-4xl mb-4">🌍</div>
				<h3 class="text-xl font-semibold text-[#FFBC03] mb-3">2. Exposure</h3>
				<p class="text-gray-700 leading-relaxed">
					Once their foundation is strong, we help them build the platforms and partnerships
					necessary for visibility — from branding and digital presence to international showcases
					and collaborations.
				</p>
			</div>

			<div class="process-card p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
				<div class="text-4xl mb-4">🚀</div>
				<h3 class="text-xl font-semibold text-[#D9042B] mb-3">3. Delivery</h3>
				<p class="text-gray-700 leading-relaxed">
					We support the logistics and pipelines to deliver products and services to the global
					market, ensuring creators gain recognition, sustainability, and impact.
				</p>
			</div>
		</div>
	</section>

	<!-- WHY WE DO IT -->
	<section class="fade-section py-20 px-8 text-center bg-white">
		<h2 class="text-3xl font-bold text-[#D9042B] mb-6">Why We Do It</h2>
		<p class="max-w-4xl mx-auto text-gray-700 leading-relaxed text-lg">
			Africa’s creative and entrepreneurial potential is unmatched — but too often under-supported.
			DiasporaJunxion exists to bridge that gap by connecting local talent with diaspora resources,
			mentorship, and markets. We empower Ghanaian creators to own their narratives, build wealth,
			and redefine the global creative economy.
		</p>
	</section>

	<!-- WHAT WE OFFER -->
	<section class="fade-section py-20 bg-[#111] text-white px-8 text-center">
		<h2 class="text-3xl font-bold mb-10 text-[#FFBC03]">What We Offer Creators</h2>

		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
			<div class="bg-[#1a1a1a] p-6 rounded-xl shadow-sm hover:shadow-md transition">
				<h3 class="font-semibold text-lg mb-2 text-[#038C25]">💬 Mentorship & Training</h3>
				<p class="text-gray-300 text-sm">
					Direct access to seasoned mentors and professionals from Ghana and the diaspora.
				</p>
			</div>

			<div class="bg-[#1a1a1a] p-6 rounded-xl shadow-sm hover:shadow-md transition">
				<h3 class="font-semibold text-lg mb-2 text-[#FFBC03]">💰 Access to Funding</h3>
				<p class="text-gray-300 text-sm">
					Microgrants, investor connections, and capital pathways to bring ideas to life.
				</p>
			</div>

			<div class="bg-[#1a1a1a] p-6 rounded-xl shadow-sm hover:shadow-md transition">
				<h3 class="font-semibold text-lg mb-2 text-[#D9042B]">🎨 Product & Brand Development</h3>
				<p class="text-gray-300 text-sm">
					Helping refine storytelling, packaging, and strategy for creative ventures.
				</p>
			</div>

			<div class="bg-[#1a1a1a] p-6 rounded-xl shadow-sm hover:shadow-md transition">
				<h3 class="font-semibold text-lg mb-2 text-[#FFBC03]">🌍 Global Market Exposure</h3>
				<p class="text-gray-300 text-sm">
					Connecting creators to international stages, digital platforms, and collaborations.
				</p>
			</div>

			<div class="bg-[#1a1a1a] p-6 rounded-xl shadow-sm hover:shadow-md transition">
				<h3 class="font-semibold text-lg mb-2 text-[#038C25]">🤝 International Partnerships</h3>
				<p class="text-gray-300 text-sm">
					Building bridges between Ghanaian creatives and diaspora investors, brands, and educators.
				</p>
			</div>

			<div class="bg-[#1a1a1a] p-6 rounded-xl shadow-sm hover:shadow-md transition">
				<h3 class="font-semibold text-lg mb-2 text-[#D9042B]">🎉 Events & Residencies</h3>
				<p class="text-gray-300 text-sm">
					In-person programs, showcases, and nightlife exchanges that foster connection and
					collaboration.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-24 bg-[#038C25] text-center text-white">
		<h2 class="text-3xl font-extrabold mb-4">Join the Movement</h2>
		<p class="max-w-2xl mx-auto text-lg mb-8 text-white/90">
			Whether you’re a creator, mentor, or investor — there’s a place for you at the Junxion.
		</p>
		<a
			href="/#contact"
			class="inline-block bg-white text-[#038C25] font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition"
			>Connect With Us</a
		>
	</section>
</div>

<style>
	html {
		scroll-behavior: smooth;
	}
	section {
		scroll-margin-top: 100px;
	}
</style>
