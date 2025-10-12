<script>
	import Hero from '$lib/tours/Hero.svelte';
	import Itinerary from '$lib/tours/Itinerary.svelte';
	import Cta from '$lib/tours/CTA.svelte';
	import CalendlyModal from '$lib/tours/CalendlyModal.svelte';

	export let data;
	let { tours } = data;

	let showModal = false;
	const openModal = () => (showModal = true);
	const closeModal = () => (showModal = false);

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
</script>

<section class="bg-white text-gray-900">
	<div class="max-w-6xl mx-auto px-6 py-12">
		<Hero
			title="10-Day Ghana Immersion"
			subtitle="An immersive, soul-forward 10-day experience across Accra, the Central Coast, Kakum, the Volta, and community projects — curated for connection, culture, and meaning."
		/>

		<Itinerary steps={itinerary} />

		<!-- CTA section -->
		<div class="mt-20">
			<!-- When CTA button emits event, open Calendly modal -->
			<Cta on:openDiscoveryCall={openModal} on:openReservationModal={openModal} />
		</div>
	</div>
</section>

<!-- Calendly Modal -->
<CalendlyModal
	show={showModal}
	calendlyUrl="https://calendly.com/diasporajunxion/discovery-call-ghana-immersion-experience"
	onClose={closeModal}
/>
