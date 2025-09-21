<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	const team = [
		{
			name: 'Xavi',
			role: 'Visionary · Entrepreneur · Digital Architect',
			image: '/images/team/xavi.jpg',
			bio: 'Building bridges between diaspora and homeland through creativity, tech, and embodied presence.'
		},
		{
			name: 'Soji',
			role: 'Illustrator · Musician · Creative Director',
			image: '/images/team/soji.jpg',
			bio: 'Crafting the Afro-futurist visual language of Diaspora Junxion with bold imagination and design.'
		},
		{
			name: 'Space',
			role: 'Craftsman · Artisan · Chief Technician',
			image: '/images/team/space.jpg',
			bio: 'Blending tradition and innovation into wearable art and crafted experiences that resonate deeply.'
		}
	];

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		gsap.utils.toArray('.team-section').forEach((section, i) => {
			const img = section.querySelector('.team-image');
			const text = section.querySelector('.team-text');

			// Animate image
			gsap.from(img, {
				scrollTrigger: {
					trigger: section,
					start: 'top 80%',
					once: true
				},
				x: i % 2 === 0 ? -100 : 100,
				opacity: 0,
				duration: 1,
				ease: 'power3.out'
			});

			// Animate text
			gsap.from(text, {
				scrollTrigger: {
					trigger: section,
					start: 'top 80%',
					once: true
				},
				x: i % 2 === 0 ? 100 : -100,
				opacity: 0,
				duration: 1,
				delay: 0.2,
				ease: 'power3.out'
			});
		});
	});
</script>

<section class="bg-white text-black min-h-screen py-16 px-4 sm:px-12">
	<h1 class="text-4xl sm:text-5xl font-bold text-center mb-4 text-[#D9042B]">Meet the Team</h1>
	<p class="text-center text-lg sm:text-xl mb-16 max-w-2xl mx-auto text-gray-700">
		We’re creators, builders, and cultural guides shaping the Diaspora Junxion journey.
	</p>

	<div class="flex flex-col gap-32">
		{#each team as person, i}
			<div
				class="team-section flex flex-col lg:flex-row items-center gap-10 lg:gap-16 {i % 2 === 1
					? 'lg:flex-row-reverse'
					: ''}"
			>
				<div class="team-image flex-shrink-0 w-full lg:w-1/2 flex justify-center">
					<img
						src={person.image}
						alt={person.name}
						class="w-64 h-64 object-cover rounded-full border-8 border-[#F2B705] shadow-xl"
					/>
				</div>
				<div class="team-text w-full lg:w-1/2 text-center lg:text-left">
					<h2 class="text-2xl sm:text-3xl font-semibold text-[#038C25] mb-2">{person.name}</h2>
					<p class="text-lg font-medium text-[#F29F05] mb-4">{person.role}</p>
					<p class="text-base text-gray-600 leading-relaxed">{person.bio}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
