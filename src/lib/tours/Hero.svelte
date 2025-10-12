<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let title;
	export let subtitle;

	onMount(() => {
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
	});
</script>

<section class="text-center mb-12 px-4 md:px-0">
	<h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#038C25] leading-snug">
		{title}
	</h1>
	<p class="intro text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mt-4">
		{subtitle}
	</p>
</section>
