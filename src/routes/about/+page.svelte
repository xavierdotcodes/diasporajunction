<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	onMount(() => {
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
<section id="values" class="py-16 bg-[#F2B705]/10 px-8">
	<h3 class="text-3xl font-bold text-black mb-10 text-center">What We Stand For</h3>
	<div class="grid md:grid-cols-3 gap-6">
		<div class="bg-white p-6 rounded-xl border border-[#F2B705] shadow-sm">
			<h4 class="text-xl font-bold text-[#D9042B] mb-2">Connection</h4>
			<p class="text-gray-700">We create authentic ties between diaspora and local voices.</p>
		</div>
		<div class="bg-white p-6 rounded-xl border border-[#F2B705] shadow-sm">
			<h4 class="text-xl font-bold text-[#038C25] mb-2">Culture</h4>
			<p class="text-gray-700">
				From food to fashion, music to language — we honor what makes us unique.
			</p>
		</div>
		<div class="bg-white p-6 rounded-xl border border-[#F2B705] shadow-sm">
			<h4 class="text-xl font-bold text-[#F27405] mb-2">Collaboration</h4>
			<p class="text-gray-700">Artists, makers, entrepreneurs — we grow stronger together.</p>
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
		href="/#tour"
		class="inline-block bg-[#038C25] text-white px-6 py-3 rounded-full font-bold hover:bg-[#026b1d] transition"
	>
		Join The Movement
	</a>
</section>

<!-- Footer -->
<footer class="bg-[#F2B705] border-t-4 border-black py-6 px-8 text-center text-black">
	<p class="text-sm">© 2025 DiasporaJunxion. All rights reserved.</p>
	<div class="mt-2 space-x-4">
		<a href="https://x.com/diasporajunxn" class="hover:underline">X</a>
		<a href="https://youtube.com/@diasporajunxion" class="hover:underline">YouTube</a>
		<a href="https://tiktok.com/@diasporajunxion" class="hover:underline">TikTok</a>
	</div>
</footer>

<style>
	section {
		scroll-margin-top: 100px;
	}
</style>
