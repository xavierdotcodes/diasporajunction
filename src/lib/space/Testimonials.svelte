<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/space/Testimonials.svelte');

	let { reviews = [
		{ name: 'Ayo', text: 'The SP△CE speaker blew me away. Best purchase this year!' },
		{ name: 'Lina', text: 'Crystal-clear sound and stunning design. Love it!' }
	] } = $props();
</script>

<section class="testimonials">
	<h2>Don’t just take our word for it</h2>
	<div class="reviews">
		{#each reviews as review}
			<div class="review">
				<p>"{review.text}"</p>
				<span>- {review.name}</span>
			</div>
		{/each}
	</div>
</section>

<style>
	.testimonials {
		text-align: center;
		margin: 4rem 0;
	}
	.testimonials h2 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}
	.reviews {
		display: flex;
		gap: 2rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	.review {
		max-width: 300px;
		background: #51331b;
		color: #fff;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}
	.review span {
		display: block;
		margin-top: 1rem;
		font-weight: bold;
	}
</style>
