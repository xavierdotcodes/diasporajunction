	<script>
	import { onMount } from 'svelte';
	import { fileLogger } from '$lib/utils/logger';

	const log = fileLogger('src/lib/payment/PaymentForm.svelte');
	import { getStripe } from '$lib/payment/client.js';

	let { clientSecret, cardElement = $bindable() } = $props();

	let stripe;
	let elements;
	let card;

	onMount(async () => {
		log.info({ phase: 'payment_form_mount' });
		stripe = await getStripe();

		if (!stripe) {
			log.error({ phase: 'payment_form_stripe_missing' });
			return;
		}

		elements = stripe.elements({ clientSecret });

		card = elements.create('card');
		card.mount('#card-element');

		// Bind card to parent
		cardElement = card;
		log.info({ phase: 'payment_form_card_ready' });
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
