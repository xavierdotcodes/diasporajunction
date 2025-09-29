<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Hero animation
		gsap.from('.about-hero span', {
			y: 40,
			opacity: 0,
			stagger: 0.15,
			duration: 1,
			ease: 'power4.out'
		});

		gsap.from('.about-cta', {
			scale: 0.8,
			opacity: 0,
			delay: 1.5,
			duration: 0.6,
			ease: 'back.out(1.7)'
		});

		// Values alternating animation
		gsap.utils.toArray('.value-block').forEach((block, i) => {
			const fromX = i % 2 === 0 ? -150 : 150; // odd = left, even = right
			gsap.from(block, {
				x: fromX,
				opacity: 0,
				duration: 1,
				ease: 'power4.out',
				scrollTrigger: {
					trigger: block,
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				}
			});
		});
	});
</script>

<!-- Hero Section -->
<section class="bg-white py-20 px-8 text-center">
	<h2 class="about-hero text-4xl font-extrabold text-black mb-4">
		<span class="text-[#D9042B]">About</span>
		<span class="text-[#038C25]">DiasporaJunxion</span>
	</h2>
	<p class="text-lg text-gray-700 max-w-xl mx-auto mb-6">
		We’re more than a project — we’re a <span class="text-[#F27405] font-semibold">movement</span>
		bridging global creatives and local communities through culture, travel, and collaboration.
	</p>
	<a
		href="#story"
		class="about-cta inline-block bg-[#D9042B] text-white px-6 py-3 rounded-full font-bold shadow hover:scale-105 transition"
	>
		Read Our Story
	</a>
</section>

<!-- Story Section -->
<section id="story" class="py-16 bg-white px-8">
	<h3 class="text-3xl font-bold text-black mb-8 text-center">Our Story</h3>
	<div class="max-w-3xl mx-auto text-gray-700 space-y-4 text-lg">
		<p>
			DiasporaJunxion started with one simple question: how can we make the bridge between the
			African diaspora and the continent more real, more joyful, and more creative?
		</p>
		<p>
			From music tours to language lessons, from underground art collectives to global collabs, we
			exist to create <span class="text-[#038C25] font-semibold">connection</span> that goes beyond content.
		</p>
		<p>
			Every project, every event, every livestream is designed to spark discovery, honor roots, and
			celebrate new possibilities.
		</p>
	</div>
</section>

<!-- Values Section -->
<section id="values" class="py-20 bg-[#798EDF] px-8">
	<h3 class="text-3xl font-bold text-black mb-16 text-center">What We Stand For</h3>

	<div class="space-y-20 max-w-5xl mx-auto">
		<!-- Value 1 -->
		<div class="value-block flex flex-col md:flex-row items-center gap-8">
			<img
				src="/images/connection.jpg"
				alt="Connection"
				class="w-full md:w-1/2 rounded-xl shadow"
			/>
			<div class="md:w-1/2 text-center md:text-left">
				<h4 class="text-2xl font-bold text-[#D9042B] mb-3">Connection</h4>
				<p class="text-gray-700 text-lg">
					We create authentic ties between diaspora and local voices.
				</p>
			</div>
		</div>

		<!-- Value 2 -->
		<div class="value-block flex flex-col md:flex-row-reverse items-center gap-8">
			<img src="/images/culture.jpg" alt="Culture" class="w-full md:w-1/2 rounded-xl shadow" />
			<div class="md:w-1/2 text-center md:text-left">
				<h4 class="text-2xl font-bold text-[#038C25] mb-3">Culture</h4>
				<p class="text-gray-700 text-lg">
					From food to fashion, music to language — we honor what makes us unique.
				</p>
			</div>
		</div>

		<!-- Value 3 -->
		<div class="value-block flex flex-col md:flex-row items-center gap-8">
			<img
				src="/images/collaboration.jpg"
				alt="Collaboration"
				class="w-full md:w-1/2 rounded-xl shadow"
			/>
			<div class="md:w-1/2 text-center md:text-left">
				<h4 class="text-2xl font-bold text-[#FFBC03] mb-3">Collaboration</h4>
				<p class="text-gray-700 text-lg">
					Artists, makers, entrepreneurs — we grow stronger together.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Call to Action -->
<section id="join" class="py-16 bg-white text-center px-8">
	<h3 class="text-3xl font-bold text-black mb-6">Be Part of the Junxion</h3>
	<p class="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
		Whether you’re diaspora, local, or global fam, your energy is welcome here. Join us for tours,
		events, or digital collabs — let’s make it real.
	</p>
	<a
		href=""
		class="inline-block bg-[#038C25] text-white px-6 py-3 rounded-full font-bold hover:bg-[#026b1d] transition"
	>
		Join The Movement
	</a>
</section>

<style>
	section {
		scroll-margin-top: 100px;
	}
</style>
