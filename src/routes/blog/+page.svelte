<script>
	import { onMount } from 'svelte';
	import { revealOnScroll } from '$lib/animations/scrollReveal.js';
	import BlogGrid from '$lib/blog/BlogGrid.svelte';

	let posts = [
		{
			title: 'Nightlife x Creativity',
			slug: 'nightlife-creativity',
			cover: '/images/blog1.jpg',
			excerpt: 'How Ghana’s underground parties drive new culture.'
		},
		{
			title: 'The Return Home',
			slug: 'return-home',
			cover: '/images/blog2.jpg',
			excerpt: 'Diaspora dreams, Ghana roots — where energy meets opportunity.'
		},
		{
			title: 'NDGO: The Art of Growth',
			slug: 'ndgo-art-growth',
			cover: '/images/blog3.jpg',
			excerpt: 'Inside our art residency redefining community and flow.'
		}
	];

	let grid;

	onMount(() => {
		if (typeof window === 'undefined') return;
		revealOnScroll(grid);
	});
</script>

<section class="p-6 md:p-12">
	<h1 class="text-4xl font-bold mb-6 text-balance">The Junxion Journal</h1>

	<!-- Pure CSS Masonry -->
	<div bind:this={grid}>
		<BlogGrid {posts} />
	</div>
</section>

<style>
	.blog-card {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.4s ease,
			transform 0.4s ease;
	}
	.blog-card.revealed {
		opacity: 1;
		transform: translateY(0);
	}
</style>
