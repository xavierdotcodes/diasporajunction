<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	import Cta from '$lib/tours/CTA.svelte';
	import BookingModal from '$lib/tours/BookingModal.svelte';

	// data comes from +page.server.js
	export let data;
	let { tours } = data;

	let showModal = false;
	const openModal = () => (showModal = true);
	const closeModal = () => (showModal = false);

	// Itinerary (static descriptive content)
	const itinerary = [
		{
			day: 'Day 1–2',
			title: 'Arrival & Accra Vibes',
			copy: 'Arrive in Accra, get settled in our boutique guesthouse, enjoy a welcome dinner with a live drumming circle. Afternoon beach time at Labadi, followed by a curated night out to experience Accra’s contemporary music scene and local street food.',
			image:
				'https://images.unsplash.com/photo-1520975913164-9d0902d8a8d8?q=80&w=1400&auto=format&fit=crop'
		},
		{
			day: 'Day 3–4',
			title: 'Cape Coast Heritage',
			copy: 'Drive along the scenic coastal road to Cape Coast. Guided visits to Cape Coast Castle and Elmina Castle with a local historian. Evening storytelling session and Ancestral workshop exploring family history and the Door of No Return.',
			image:
				'https://images.unsplash.com/photo-1563352139-7f8e3d8f6b72?q=80&w=1400&auto=format&fit=crop'
		},
		{
			day: 'Day 5–6',
			title: 'Kakum Canopy & Nature Trails',
			copy: 'Morning canopy walk at Kakum National Park, guided birdwatching and forest bath. Afternoon cultural cooking class with farm-to-table ingredients, followed by sunset at a secluded coastal viewpoint.',
			image:
				'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1400&auto=format&fit=crop'
		},
		{
			day: 'Day 7–8',
			title: 'Volta Region Exploration',
			copy: 'Head to the Volta Region: hike to waterfalls, canoe on the Volta, and visit traditional Ewe communities for cultural exchange and textile workshops. Overnight stay in a mountain lodge with guided stargazing.',
			image:
				'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop'
		},
		{
			day: 'Day 9–10',
			title: 'Community Project & Farewell',
			copy: 'Participate in a short community service project (school or craft co-op), join a final ceremony with performances, and enjoy a farewell party with gifts and certificates of participation.',
			image:
				'https://images.unsplash.com/photo-1542144582-1ba0046e6f10?q=80&w=1400&auto=format&fit=crop'
		}
	];

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Hero animation
		gsap.from('h1', {
			duration: 1,
			y: -40,
			opacity: 0,
			ease: 'power2.out'
		});
		gsap.from('.intro', {
			duration: 1,
			y: 24,
			opacity: 0,
			delay: 0.15,
			ease: 'power2.out'
		});

		// Animate itinerary steps
		gsap.utils.toArray('.itinerary-step').forEach((stepEl, i) => {
			const content = stepEl.querySelector('.step-content');
			const image = stepEl.querySelector('.step-image');
			const dir = i % 2 === 0 ? -1 : 1;

			gsap.from(content, {
				scrollTrigger: {
					trigger: stepEl,
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				},
				x: dir * -120,
				opacity: 0,
				duration: 0.8,
				ease: 'power3.out'
			});

			gsap.from(image, {
				scrollTrigger: {
					trigger: stepEl,
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				},
				x: dir * 120,
				opacity: 0,
				duration: 0.9,
				delay: 0.06,
				ease: 'power3.out'
			});
		});
	});
</script>

<section class="bg-white text-gray-900">
	<div class="max-w-6xl mx-auto px-6 py-12">
		<h1 class="text-4xl md:text-5xl font-extrabold text-center mb-4 text-[#038C25]">
			10-Day Ghana Immersion
		</h1>

		<p class="intro text-center text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12">
			An immersive, soul-forward 10-day experience across Accra, the Central Coast, Kakum, the
			Volta, and community projects — curated for connection, culture, and meaning.
		</p>

		<!-- Itinerary -->
		<div class="space-y-28">
			{#each itinerary as step, i}
				<div class="itinerary-step grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
					<!-- Image -->
					<div
						class="step-image rounded-xl overflow-hidden shadow-lg"
						class:md:order-1={i % 2 === 0}
						class:md:order-2={i % 2 !== 0}
					>
						<img
							alt={step.title}
							src={step.image}
							loading="lazy"
							class="w-full h-64 md:h-72 object-cover block"
						/>
					</div>

					<!-- Text content -->
					<div
						class="step-content bg-white p-6 rounded-xl border border-gray-100 shadow"
						class:md:order-2={i % 2 === 0}
						class:md:order-1={i % 2 !== 0}
					>
						<div class="text-sm text-gray-500 font-medium mb-1">{step.day}</div>
						<h3 class="text-2xl font-bold mb-3 text-[#F29F05]">{step.title}</h3>
						<p class="leading-relaxed text-gray-700 mb-4">{step.copy}</p>

						<ul class="text-sm text-gray-600 space-y-1">
							<li>• Local guide & translator</li>
							<li>• All transport and entrance fees included</li>
							<li>• Dietary accommodations available on request</li>
						</ul>
					</div>
				</div>
			{/each}
		</div>

		<br /><br /><br />
		<Cta on:openBookingModal={openModal} />
	</div>
</section>

{#if showModal}
	<ReservationModal {tours} on:close={closeModal} />
{/if}

<style>
	.itinerary-spacer {
		height: 60vh;
	}
</style>
