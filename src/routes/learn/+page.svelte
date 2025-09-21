<script>
	import gsap from 'gsap';
	import { onMount } from 'svelte';

	onMount(() => {
		gsap.from('h1', { duration: 1, y: -40, opacity: 0, ease: 'power2.out' });
		gsap.from('.bg-[#F2B705]', { duration: 1, y: 30, opacity: 0, delay: 0.2, ease: 'power2.out' });
		gsap.from('.grid > div', {
			duration: 0.8,
			opacity: 0,
			y: 20,
			stagger: 0.15,
			delay: 0.4,
			ease: 'power2.out'
		});
	});
</script>

<section class="min-h-screen bg-white text-gray-900 p-6">
	<div class="max-w-6xl mx-auto">
		<h1 class="text-4xl font-bold text-center mb-4 text-[#038C25]">Diaspora Junction Ghana Tour</h1>
		<p class="text-lg text-center max-w-2xl mx-auto text-gray-700 mb-10">
			Join our exclusive 10-day cultural immersion in Ghana. One unforgettable journey, one
			all-inclusive package. Rediscover home for <span class="font-bold text-[#D9042B]">$2499</span
			>.
		</p>

		<div class="bg-[#F2B705] text-white p-6 rounded-xl shadow-lg mb-10">
			<h2 class="text-2xl font-bold mb-2">🌍 10-Day Full Ghana Experience</h2>
			<p class="mb-4">
				Includes accommodation, transportation, guided tours, meals, workshops, beach time, and
				nightlife experiences.
			</p>
			<span class="text-3xl font-bold">$2499</span>
			<a
				href="/book"
				class="block mt-4 bg-[#D9042B] hover:bg-[#F27405] text-white font-semibold px-6 py-3 rounded-full text-center w-max"
				>Reserve Your Spot</a
			>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="p-6 rounded-xl border border-gray-200 shadow hover:shadow-md">
				<h3 class="text-xl font-bold text-[#F29F05] mb-2">Day 1-2: Arrival & Accra Vibes</h3>
				<p>
					Welcome dinner, beach relaxation, cultural orientation, and Accra nightlife with local
					guides.
				</p>
			</div>
			<div class="p-6 rounded-xl border border-gray-200 shadow hover:shadow-md">
				<h3 class="text-xl font-bold text-[#F29F05] mb-2">Day 3-4: Cape Coast Heritage</h3>
				<p>
					Tour Cape Coast Castle, Elmina Castle, and Assin Manso. Experience drumming, dance, and
					local cuisine.
				</p>
			</div>
			<div class="p-6 rounded-xl border border-gray-200 shadow hover:shadow-md">
				<h3 class="text-xl font-bold text-[#F29F05] mb-2">Day 5-6: Nature & Adventure</h3>
				<p>
					Visit Kakum National Park canopy walk, Aburi gardens, and explore scenic nature trails.
				</p>
			</div>
			<div class="p-6 rounded-xl border border-gray-200 shadow hover:shadow-md">
				<h3 class="text-xl font-bold text-[#F29F05] mb-2">Day 7-8: Volta Region Exploration</h3>
				<p>
					Waterfalls, traditional villages, Ewe cultural exchange, and beautiful mountain vistas.
				</p>
			</div>
			<div class="p-6 rounded-xl border border-gray-200 shadow hover:shadow-md">
				<h3 class="text-xl font-bold text-[#F29F05] mb-2">Day 9-10: Community & Sendoff</h3>
				<p>
					Service project visit, storytelling circles, farewell party, and closing ceremony with
					gifts.
				</p>
			</div>
		</div>

		<div class="mt-16 text-center">
			<a href="/learn" class="text-[#038C25] font-semibold underline"
				>Check Out Our Language Courses</a
			>
		</div>
	</div>
</section>
