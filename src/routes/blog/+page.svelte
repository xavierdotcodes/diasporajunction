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

	onMount(async () => {
		// Dynamically import Masonry only on the client
		const Masonry = (await import('masonry-layout')).default;

		const msnry = new Masonry(grid, {
			itemSelector: '.blog-card',
			columnWidth: '.blog-card',
			gutter: 24,
			percentPosition: true
		});

		revealOnScroll(grid);

		// Re-layout on resize
		window.addEventListener('resize', () => msnry.layout());
	});
</script>

<section class="p-6 md:p-12">
	<h1 class="text-4xl font-bold mb-6">The Junxion Journal</h1>
	<div bind:this={grid}>
		<BlogGrid {posts} />
	</div>
</section>
