<script>
	import { onMount, createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let stripe;
	let elements;
	let card;

	onMount(() => {
		if (!window.Stripe) {
			const script = document.createElement('script');
			script.src = 'https://js.stripe.com/v3/';
			script.onload = initStripe;
			document.body.appendChild(script);
		} else {
			initStripe();
		}
	});

	function initStripe() {
		stripe = Stripe('pk_test_yourPublishableKey'); // replace with real key
		elements = stripe.elements();
		card = elements.create('card', {
			style: {
				base: {
					color: '#fff',
					fontSize: '16px',
					'::placeholder': { color: '#9ca3af' }
				},
				invalid: { color: '#f87171' }
			}
		});
		card.mount('#card-element');
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const { paymentMethod, error } = await stripe.createPaymentMethod({
			type: 'card',
			card: card
		});

		if (error) {
			alert(error.message);
			return;
		}

		dispatch('submit', { type: 'card', id: paymentMethod.id });
	}
</script>

<div class="bg-neutral-800 p-4 rounded-lg border border-neutral-600">
	<label class="block text-sm mb-2">Card Details</label>
	<div id="card-element" class="p-3 bg-neutral-900 rounded-md"></div>
</div>

<button
	class="w-full mt-4 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
	on:click={handleSubmit}
>
	Pay with Card
</button>
