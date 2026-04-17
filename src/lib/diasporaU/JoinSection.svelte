<script>
	import { onMount } from 'svelte';
	import { revealOnScroll } from '$lib/animations/scrollReveal';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/diasporaU/JoinSection.svelte');
	let section = $state();

	onMount(() => revealOnScroll(section));
</script>

<section class="join" bind:this={section}>
	<div class="parallax" style="background-image: url('/images/du_join.jpg');"></div>
	<h2>Join the Movement</h2>
	<p>
		Be part of the first global club powered by the Diaspora. Own a piece. Visit. Play. Build the
		future of African football.
	</p>
	<button>Get Involved</button>
</section>

<style>
	.join {
		min-height: 100vh;
		padding: 8rem 2rem;
		background: #083d2d;
		color: white;
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	button {
		background: white;
		color: #083d2d;
		padding: 0.75rem 1.5rem;
		border-radius: 9999px;
		font-weight: 700;
		text-transform: uppercase;
		margin-top: 1.5rem;
		transition: transform 0.3s ease;
	}
	button:hover {
		transform: scale(1.05);
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
	p,
	button {
		position: relative;
		z-index: 2;
	}
</style>
