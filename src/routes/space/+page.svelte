<script>
	import CTA from '$lib/space/CTA.svelte';
	import Hero from '$lib/space/Hero.svelte';
	import CheckoutModal from '$lib/payment/CheckoutModal.svelte';

	let showModal = false;
</script>

<section class="space-wrapper">
	<Hero />
	<CTA on:openModal={() => (showModal = true)} />
</section>

{#if showModal}
	<CheckoutModal on:close={() => (showModal = false)} />
{/if}

<style>
	.space-wrapper {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4rem;
		box-sizing: border-box;
	}

	@media (max-width: 768px) {
		.space-wrapper {
			padding: 1.5rem 1rem;
			gap: 3rem;
		}
	}

	@media (max-width: 480px) {
		.space-wrapper {
			padding: 1rem;
			gap: 2rem;
		}
	}
</style>
