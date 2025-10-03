<script>
	import CustomerInfoForm from './CustomerInfoForm.svelte';
	import PaymentForm from './PaymentForm.svelte';
	import { startPayment, completePayment, cancelPaymentIntent } from '$lib/client/stripe.js';
	import { createEventDispatcher } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { getStripe } from '$lib/client/stripe';

	const dispatch = createEventDispatcher();
	let step = 1;
	let clientSecret = null;
	let orderid = null;
	let loading = false;
	let continueLoading = false;

	let customer = {
		name: '',
		email: '',
		street: '',
		apt: '',
		city: '',
		state: '',
		country: '',
		zip: ''
	};

	let cardElement = null;

	// CLOSE: cancel payment + reset + tell parent
	async function close() {
		if (clientSecret && step !== 3) await cancelPaymentIntent(clientSecret);

		clientSecret = null;
		orderid = null;
		step = 1;
		loading = false;
		continueLoading = false;
		dispatch('close');
	}

	// Overlay click ALWAYS closes the modal
	function handleOverlayClick() {
		close();
	}

	async function nextStep() {
		if (step === 1) {
			try {
				continueLoading = true;
				clientSecret = await startPayment();
				step = 2;
			} catch (err) {
				console.error('Error starting payment:', err);
				alert('Failed to start payment. Please try again.');
			} finally {
				continueLoading = false;
			}
		} else if (step === 2) {
			await handlePaymentSubmit();
		}
	}

	async function handlePaymentSubmit() {
		if (!clientSecret || !cardElement) return;

		try {
			loading = true;

			// Complete payment on server
			const res = await completePayment(clientSecret, cardElement, customer);

			switch (res.status) {
				case 'succeeded':
					// Payment complete → show thank you
					orderid = res.id;
					step = 3;
					clientSecret = null;
					break;

				case 'requires_payment_method':
					// Declined → user must retry
					alert('Payment declined, please try another card.');
					break;

				case 'requires_action':
					// Needs 3D Secure or extra auth
					const stripe = getStripe();
					const result = await stripe.confirmCardPayment(res.client_secret);

					if (result.error) {
						// 3DS failed
						alert('Payment authentication failed: ' + result.error.message);
					} else if (result.paymentIntent.status === 'succeeded') {
						orderid = result.paymentIntent.id;
						step = 3;
						clientSecret = null;
					} else {
						alert('Unexpected payment status after authentication.');
						console.error('Unexpected post-3DS status:', result.paymentIntent.status);
					}
					break;

				default:
					alert('Unexpected payment status.');
					console.error('Unexpected payment status:', res);
			}
		} catch (err) {
			console.error('❌ Payment error:', err);
			alert('Payment failed: ' + err.message);
		} finally {
			loading = false;
		}
	}

	function backStep() {
		if (step === 2) {
			if (clientSecret) {
				cancelPaymentIntent(clientSecret);
				clientSecret = null;
			}
			step = 1;
		}
	}
</script>

<div class="modal-overlay" on:click={handleOverlayClick}>
	<div class="modal" on:click|stopPropagation>
		<button class="close" on:click={close} aria-label="Close modal">✕</button>

		{#if step === 1}
			<h2 class="title">Step 1: Enter Your Information</h2>
			<CustomerInfoForm bind:customer />
			<button class="primary" on:click={nextStep} disabled={continueLoading}>
				{#if continueLoading}
					<span class="loader"></span> Loading...
				{:else}
					Continue
				{/if}
			</button>
		{:else if step === 2}
			<h2 class="title">Step 2: Payment</h2>
			<PaymentForm {clientSecret} bind:cardElement />
			<div class="flex gap-3 mt-4">
				<button class="secondary" on:click={backStep}>Back</button>
				<button class="primary" on:click={nextStep} disabled={!cardElement || loading}>
					{#if loading}
						<span class="loader"></span> Processing...
					{:else}
						Pay Now
					{/if}
				</button>
			</div>
		{:else if step === 3}
			<div class="thank-you">
				<h2>Thank You!</h2>
				<p>Your payment was successful.</p>
				<p><strong>Order ID:</strong> {orderid}</p>
				<button class="primary" on:click={close}>Close</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}
	.modal {
		background: #111827;
		padding: 2rem;
		border-radius: 1rem;
		max-width: 500px;
		width: 95%;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		color: #f9fafb;
	}
	.title {
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
		color: #e0e7ff;
		margin-bottom: 0.5rem;
	}
	.close {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #f9fafb;
		cursor: pointer;
	}
	.primary {
		background: #6366f1;
		color: #fff;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}
	.primary:hover:enabled {
		background: #818cf8;
	}
	.primary:disabled {
		background: #c7d2fe;
		cursor: not-allowed;
	}
	.secondary {
		background: #e5e7eb;
		color: #111827;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}
	.secondary:hover {
		background: #d1d5db;
	}
	.loader {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-right: 0.5rem;
		vertical-align: middle;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.thank-you {
		text-align: center;
		padding: 2rem 1rem;
		background: #1e293b;
		border-radius: 1rem;
		color: #f0f9ff;
	}
	.thank-you h2 {
		font-size: 2rem;
		color: #60a5fa;
		margin-bottom: 0.5rem;
	}
	.thank-you p {
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}
</style>
