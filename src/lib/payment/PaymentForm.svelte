<script>
	import { onMount } from 'svelte';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/lib/payment/PaymentForm.svelte');
	import { getStripe } from '$lib/client/stripe.js'; // your existing module

	let { clientSecret, cardElement = $bindable() } = $props();

	let stripe;
	let elements;
	let card;

	onMount(async () => {
		stripe = await getStripe();

		if (!stripe) {
			console.error('Stripe failed to initialize.');
			return;
		}

		elements = stripe.elements({ clientSecret });

		card = elements.create('card');
		card.mount('#card-element');

		// Bind card to parent
		cardElement = card;
	});
</script>

<div class="space-y-6">
	<p class="text-sm text-gray-600 text-center max-w-md mx-auto">
		Securely enter your payment details below.
	</p>

	<div id="card-element" class="card-element"></div>
</div>

<style>
	.card-element {
		border: 2px solid #d1d5db;
		border-radius: 0.75rem;
		padding: 0.7rem 1rem;
		background: #fff;
	}
</style>
