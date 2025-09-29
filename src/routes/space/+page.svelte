<script>
	import Hero from '$lib/space/Hero.svelte';
	import FeatureBlock from '$lib/space/FeatureBlock.svelte';
	import CTA from '$lib/space/CTA.svelte';
	import Footer from '$lib/layout/Footer.svelte';

	const productFeatures = [
		{
			title: 'Premium Sound',
			description:
				'Experience crystal clear audio with deep bass and vibrant highs, crafted for true music lovers.',
			image: '/images/speaker1.jpeg'
		},
		{
			title: 'Minimalist Design',
			description:
				'Our SP△CE mini speakers blend seamlessly into any home or studio with timeless elegance.',
			image: '/images/speaker2.jpeg'
		},
		{
			title: 'Built for Portability',
			description:
				'Take your music anywhere. Compact, durable, and always reliable for your adventures.',
			image: '/images/speaker3.jpeg'
		},
		{
			title: 'Wireless Freedom',
			description:
				'No more tangled wires. Enjoy effortless Bluetooth connectivity with long-lasting battery life.',
			image: '/images/speaker4.jpeg'
		}
	];
</script>

<div class="product-page">
	<Hero />

	{#each productFeatures as feature, index}
		<FeatureBlock {feature} reverse={index % 2 === 1} />
	{/each}

	<CTA />
</div>

<Footer />

<style>
	.product-page {
		display: flex;
		flex-direction: column;
		gap: 6rem;
		padding: 4rem 1.5rem;
		max-width: 1200px;
		margin: 0 auto;
	}
</style>
