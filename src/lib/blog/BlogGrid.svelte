<script>
	import BlogCard from './BlogCard.svelte';
	export let posts = [];
</script>

<div class="masonry-grid">
	{#each posts as post}
		<div class="masonry-item">
			<BlogCard {post} />
		</div>
	{/each}
</div>

<style>
	.masonry-grid {
		column-count: 3;
		column-gap: 1.5rem;
		width: 100%;
	}

	.masonry-item {
		break-inside: avoid;
		margin-bottom: 1.5rem;
		display: inline-block;
		width: 100%;
	}

	/* Responsive adjustments */
	@media (max-width: 1024px) {
		.masonry-grid {
			column-count: 2;
		}
	}

	@media (max-width: 640px) {
		.masonry-grid {
			column-count: 1;
		}
	}
</style>
