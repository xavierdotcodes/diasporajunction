<script>
	import CTA from '$lib/space/CTA.svelte';
	import Hero from '$lib/space/Hero.svelte';
	import CheckoutModal from '$lib/payment/CheckoutModal.svelte';
	import FeatureBlock from '$lib/space/FeatureBlock.svelte';

	let showModal = false;
</script>

<Hero />
<FeatureBlock />
<CTA on:openModal={() => (showModal = true)} />

{#if showModal}
	<CheckoutModal on:close={() => (showModal = false)} />
{/if}

<style>
	@media (max-width: 768px) {
	}

	@media (max-width: 480px) {
	}
</style>
