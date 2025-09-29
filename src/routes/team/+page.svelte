<script>
	import TeamMember from '$lib/team/TeamMember.svelte';

	const team = [
		{
			name: 'Xavi',
			role: 'Visionary · Entrepreneur · Digital Architect',
			image: '/images/team/xavi.png',
			bio: 'Building bridges between diaspora and homeland through creativity, tech, and embodied presence.',
			socials: {
				twitter: 'https://twitter.com/xavi',
				linkedin: 'https://linkedin.com/in/xavi'
			}
		},
		{
			name: 'Soji',
			role: 'Illustrator · Musician · Creative Director',
			image: '/images/team/soji.jpg',
			bio: 'Crafting the Afro-futurist visual language of Diaspora Junxion with bold imagination and design.',
			socials: {
				instagram: 'https://instagram.com/soji'
			}
		},
		{
			name: 'Space',
			role: 'Craftsman · Artisan · Chief Technician',
			image: '/images/team/space.jpg',
			bio: 'Blending tradition and innovation into wearable art and crafted experiences that resonate deeply.',
			socials: {
				github: 'https://github.com/space'
			}
		}
	];
</script>

<section class="bg-white text-black min-h-screen py-16 px-4">
	<div class="max-w-5xl mx-auto">
		<h1 class="text-3xl sm:text-5xl font-bold text-center mb-6 text-[#D9042B]">Meet the Team</h1>
		<p class="text-center text-base sm:text-xl mb-16 max-w-2xl mx-auto text-gray-700">
			We’re creators, builders, and cultural guides shaping the Diaspora Junxion journey.
		</p>

		<div class="flex flex-col gap-20 sm:gap-28">
			{#each team as person, i}
				<TeamMember {...person} index={i} />
			{/each}
		</div>
	</div>
</section>
