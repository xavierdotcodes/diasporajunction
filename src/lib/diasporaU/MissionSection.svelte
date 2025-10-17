<script>
	import { onMount } from 'svelte';
	import { revealOnScroll } from '$lib/animations/scrollReveal';
	let section;

	onMount(() => revealOnScroll(section));
</script>

<section class="about" bind:this={section}>
	<div class="parallax" style="background-image: url('/images/du_mission.jpg');"></div>
	<h2>Our Mission</h2>
	<p>
		To build a bridge between continents through football — connecting athletes, artists, and
		entrepreneurs in a shared journey of mastery and belonging.
	</p>
	<p>We play for more than goals — we play for the Diaspora.</p>
</section>

<style>
	.about {
		min-height: 100vh;
		padding: 8rem 2rem;
		background: #fafafa;
		color: #111;
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
