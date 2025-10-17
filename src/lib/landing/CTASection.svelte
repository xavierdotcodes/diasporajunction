<script>
	import { createEventDispatcher } from 'svelte';
	import SubscribeModal from './SubscribeModal.svelte';

	let showModal = false;

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}
</script>

<section class="py-16 sm:py-20 px-6 text-center">
	<div class="max-w-3xl mx-auto">
		<h3 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Join the Movement</h3>
		<p class="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
			Whether you’re diaspora, local, or global fam, your energy is welcome here. Join us for tours,
			events, or digital collabs — let’s make it real.
		</p>
		<button on:click={openModal} class="cta-btn">Get Involved</button>
	</div>

	{#if showModal}
		<SubscribeModal on:close={closeModal} />
	{/if}
</section>

<style>
	.cta-btn {
		background: #d9042b;
		color: #fff;
		font-weight: 700;
		font-size: 1rem;
		padding: 0.85rem 2rem;
		border-radius: 9999px;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease,
			background 0.25s ease;
	}
	.cta-btn:hover {
		background: #b50323;
		transform: scale(1.05);
		box-shadow: 0 8px 24px rgba(217, 4, 43, 0.4);
	}
</style>
