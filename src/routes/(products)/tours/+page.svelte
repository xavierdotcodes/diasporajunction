<script>
	import Itinerary from '$lib/tours/Itinerary.svelte';
	import Cta from '$lib/tours/CTA.svelte';
	import CalendlyModal from '$lib/tours/CalendlyModal.svelte';
	import Hero from '$lib/components/shared/Hero.svelte';
	import Title from '$lib/components/shared/Title.svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/routes/(products)/tours/+page.svelte');

	let title = '10-day Ghana Immersion';

	let showModal = $state(false);
	const openModal = () => (showModal = true);
	const closeModal = () => (showModal = false);

	const itinerary = [
		{
			day: 'Day 1–2',
			title: 'Arrival & Accra Vibes',
			copy: 'Arrive in Accra, get settled in our boutique guesthouse, enjoy a welcome dinner with a live drumming circle. Afternoon beach time at Labadi, followed by a curated night out to experience Accra’s contemporary music scene and local street food.',
			images: [
				'/images/tours/arrival1.webp',
				'/images/tours/arrival2.webp',
				'/images/tours/arrival3.webp'
			]
		},
		{
			day: 'Day 3–4',
			title: 'Aburi Mountains & Waterfalls',
			copy: 'Escape into nature: hike the Aburi Mountains, explore hidden waterfalls, and visit botanical gardens. Enjoy a local farm-to-table lunch and optional canopy walks. Evening relaxation at a boutique mountain lodge with sunset views.',
			images: ['/images/tours/aburi1.jpg', '/images/tours/aburi2.jpg', '/images/tours/aburi3.jpg']
		},
		{
			day: 'Day 5–6',
			title: 'Cape Coast & Kakum Canopy',
			copy: 'Drive along the scenic coastal road to Cape Coast. Visit Cape Coast Castle and Elmina Castle with a local historian. Afternoon canopy walk at Kakum National Park, guided birdwatching and forest bath. Sunset at a secluded coastal viewpoint.',
			images: [
				'/images/tours/capecoast1.jpg',
				'/images/tours/capecoast2.jpg',
				'/images/tours/tours/kakum1.jpg'
			]
		},
		{
			day: 'Day 7–8',
			title: 'Volta Region Exploration',
			copy: 'Head to the Volta Region: hike to waterfalls, canoe on the Volta, and visit traditional Ewe communities for cultural exchange and textile workshops. Overnight stay in a mountain lodge with guided stargazing.',
			images: ['/images/tours/volta1.jpg', '/images/tours/volta2.jpg', '/images/tours/volta3.jpg']
		},
		{
			day: 'Day 9–10',
			title: 'Community Project & Farewell',
			copy: 'Participate in a short community service project (school or craft co-op), join a final ceremony with performances, and enjoy a farewell party with gifts and certificates of participation.',
			images: [
				'/images/tours/farewell1.jpg',
				'/images/tours/farewell2.jpg',
				'/images/tours/farewell3.jpg'
			]
		}
	];
</script>

<section class="bg-white text-gray-900">
	<!-- Hero -->
	<Hero
		subtitle="An immersive, soul-forward 10-day experience across Accra, the Central Coast, Kakum, the Volta, and community projects — curated for connection, culture, and meaning."
		description=""
		desktopVideoSrc="/videos/desktop_tours-hero.mp4"
		desktopPosterSrc="/videos/covers/desktop_tours-hero-cover.jpg"
		mobileVideoSrc="/videos/mobile_tours-hero.mp4"
		mobilePosterSrc="/videos/covers/mobile_tours-hero-cover.jpg"
	>
		{#snippet title()}
				<Title  {title} highlight="Ghana Immersion" />
			{/snippet}
	</Hero>
	<!-- Itinerary: pushed down so it doesn't overlap hero -->
	<div class="max-w-6xl mx-auto px-6 mt-24">
		<Itinerary steps={itinerary} />
	</div>

	<!-- CTA section -->
	<div class="max-w-6xl mx-auto px-6 mt-20">
		<Cta on:openDiscoveryCall={openModal} on:openReservationModal={openModal} />
	</div>
</section>

<!-- Calendly Modal -->
<CalendlyModal
	show={showModal}
	calendlyUrl="https://calendly.com/diasporajunxion/discovery-call-ghana-immersion-experience"
	onClose={closeModal}
/>
