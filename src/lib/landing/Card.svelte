<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/landing/Card.svelte');

	/**
	 * @typedef {Object} Props
	 * @property {any} card
	 * @property {number} [index]
	 */

	/** @type {Props} */
	let { card, index = 0 } = $props();
</script>

<div
	class="card flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 max-w-5xl w-full {index %
		2 ===
	0
		? 'even'
		: 'odd'}"
>
	<div class="card-image w-full md:w-1/2">
		<img src={card.image} alt={card.title} class="rounded-lg object-cover w-full h-full" />
	</div>
	<div class="card-text w-full md:w-1/2 text-center md:text-left mt-4 md:mt-0">
		<div class="text-2xl sm:text-3xl mb-2 sm:mb-3">{card.icon}</div>
		<h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{card.title}</h3>
		<p class="text-sm sm:text-base md:text-lg text-gray-300">{card.description}</p>
	</div>
</div>

<style>
	.card {
		padding: 2rem 1.5rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		width: 100%;
	}
	.card:hover {
		transform: translateY(-6px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
	}
	.card-image img {
		border-radius: 1rem;
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
	.card.even {
		flex-direction: row;
	}
	.card.odd {
		flex-direction: row-reverse;
	}

	@media (max-width: 768px) {
		.card {
			flex-direction: column;
			text-align: center;
		}
		.card-text {
			margin-top: 1.5rem;
		}
	}
</style>
