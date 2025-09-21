<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	onMount(() => {
		gsap.from('.sekondi-section', {
			y: 60,
			opacity: 0,
			duration: 1,
			stagger: 0.2,
			ease: 'power3.out'
		});
	});
</script>

<section class="bg-white text-black min-h-screen py-16 px-4 sm:px-12">
	<h1 class="text-4xl sm:text-5xl font-bold text-center mb-4 text-[black]">We ❤️ Sekondi</h1>
	<p class="text-center text-lg sm:text-xl mb-12 max-w-3xl mx-auto text-gray-700">
		Sekondi is more than a city to us — it’s family. It’s where our roots, friends, and daily
		inspirations live. It’s where resilience and creativity shine through, even in the face of
		hardship. We dedicate this page to the people of Sekondi — our collaborators, supporters, and
		neighbors. Your strength fuels Diaspora Junxion.
	</p>

	<div class="grid gap-12 lg:grid-cols-2 items-center sekondi-section">
		<img
			src="/images/sekondi/sekondi.jpg"
			alt="Sekondi view"
			class="rounded-2xl shadow-xl object-cover w-full h-80"
		/>
		<div>
			<h2 class="text-2xl sm:text-3xl font-bold text-[#038C25] mb-4">Why Sekondi?</h2>
			<p class="text-gray-700 leading-relaxed">
				We’ve called Sekondi home for the past months and discovered its beating heart. From the
				Assembly Man to the market women, from artists to tech dreamers, Sekondi holds the promise
				of tomorrow. This city is a reminder that the Diaspora is not separate from home — it’s
				deeply intertwined.
			</p>
		</div>
	</div>

	<div class="grid gap-12 lg:grid-cols-2 items-center sekondi-section mt-16">
		<div>
			<h2 class="text-2xl sm:text-3xl font-bold text-[#038C25] mb-4">Our Commitment</h2>
			<p class="text-gray-700 leading-relaxed">
				We are here not just to build products, but to build community. By shining a light on
				Sekondi’s creativity and resilience, we hope to inspire hope and opportunity. Every project,
				from our SPACE mini speakers to Awawe fashion, carries Sekondi’s spirit into the wider
				world.
			</p>
		</div>
		<img
			src="/images/sekondi/community.jpg"
			alt="Sekondi community"
			class="rounded-2xl shadow-xl object-cover w-full h-80"
		/>
	</div>

	<div class="sekondi-section text-center mt-20">
		<h2 class="text-2xl sm:text-3xl font-bold text-[#D9042B] mb-6">To Sekondi, With Love</h2>
		<p class="text-gray-700 max-w-2xl mx-auto leading-relaxed">
			From the shores of Ghana to the global stage, Sekondi will always be our heartbeat. We stand
			with you. We celebrate you. We grow with you.
		</p>
	</div>

	<!-- Adinkra Flag Symbol -->
	<div class="sekondi-section adinkra-flag mt-24">
		<img
			src="/images/sekondi/adinkra-flag.jpeg"
			alt="Adinkra symbol with American flag pattern"
			class="max-w-xs sm:max-w-sm mx-auto opacity-95 transition-transform duration-300 hover:scale-105"
		/>
	</div>
</section>

<style>
	.adinkra-flag img {
		border-radius: 1rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
	}
</style>
