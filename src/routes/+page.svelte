<script>
	import HeroSection from '$lib/landing/HeroSection.svelte';
	import AboutSection from '$lib/landing/AboutSection.svelte';
	import CardsSection from '$lib/landing/CardsSection.svelte';
	import CTASection from '$lib/landing/CTASection.svelte';
	import Footer from '$lib/layout/Footer.svelte';

	const cards = [
		{
			title: 'Connection',
			description: 'A hub for collaboration.',
			icon: '🔗',
			image: '/images/landing/connection.jpeg'
		},
		{
			title: 'Innovation',
			description: 'Bold ideas reshaping Africa.',
			icon: '💡',
			image: '/images/landing/innovation.jpeg'
		},
		{
			title: 'Culture',
			description: 'Amplifying what makes us unstoppable.',
			icon: '🎶',
			image: '/images/landing/culture.jpeg'
		},
		{
			title: 'Impact',
			description: 'Turning hustle into movement.',
			icon: '🌍',
			image: '/images/landing/impact.jpeg'
		}
	];
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="landing-page font-sans bg-black text-white">
	<HeroSection />
	<AboutSection />
	<CardsSection {cards} />
	<CTASection />
	<Footer />
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', sans-serif;
		background-color: #000;
		color: #fff;
	}
	html {
		scroll-behavior: smooth;
	}
</style>
