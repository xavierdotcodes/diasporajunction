<script>
	import { onMount } from 'svelte';
	import { revealOnScroll } from '$lib/animations/scrollReveal';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/diasporaU/ExchangeSection.svelte');
	let section = $state();

	onMount(() => revealOnScroll(section));
</script>

<section class="exchange" bind:this={section}>
	<div class="parallax" style="background-image: url('/images/du_exchange.jpg');"></div>
	<h2>The Exchange Program</h2>
	<p>
		We invite U.S.-based clubs to train, compete, and experience Ghana’s rhythm. Every visit becomes
		a living exchange of skill, story, and soul.
	</p>
	<p>Your team doesn’t just play matches — they live them.</p>
</section>

<style>
	.exchange {
		min-height: 100vh;
		padding: 8rem 2rem;
		background: #111;
		color: #fafafa;
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.parallax {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		opacity: 0.2;
		z-index: 0;
	}
	h2,
	p {
		position: relative;
		z-index: 2;
	}
</style>
