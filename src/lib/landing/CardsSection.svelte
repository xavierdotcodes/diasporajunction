<script>
	import { onMount } from 'svelte';
	import Card from './Card.svelte';
	import gsap from 'gsap';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/landing/CardsSection.svelte');

	let { cards = [] } = $props();

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const cardEls = document.querySelectorAll('.card');

		cardEls.forEach((card, i) => {
			const text = card.querySelector('.card-text');
			const img = card.querySelector('.card-image');

			gsap.from(text, {
				x: i % 2 === 0 ? -200 : 200,
				opacity: 0,
				duration: 1.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});

			gsap.from(img, {
				x: i % 2 === 0 ? 200 : -200,
				opacity: 0,
				duration: 1.2,
				delay: 0.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});
		});
	});
</script>

<section class="py-12 sm:py-16 px-4 sm:px-6">
	<div class="flex flex-col items-center w-full gap-8">
		{#each cards as card, i}
			<Card {card} index={i} />
		{/each}
	</div>
</section>
