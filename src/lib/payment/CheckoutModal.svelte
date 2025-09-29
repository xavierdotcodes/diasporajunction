<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import CustomerInfoForm from './CustomerInfoForm.svelte';
	import PaymentForm from './PaymentForm.svelte';

	const dispatch = createEventDispatcher();

	let step = 1;

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

	let paymentMethod = 'card';
	let paymentDetails = {
		number: '',
		expiry: '',
		cvc: '',
		provider: '',
		wallet: '',
		coin: 'USDT'
	};

	function close() {
		dispatch('close');
	}

	function handleOverlayClick(e) {
		if (e.target.classList.contains('modal-overlay')) {
			close();
		}
	}

	function allCustomerFieldsValid() {
		return (
			customer.name.trim() &&
			customer.email.trim() &&
			customer.street.trim() &&
			customer.city.trim() &&
			customer.state.trim() &&
			customer.country.trim() &&
			customer.zip.trim()
		);
	}

	function paymentValid() {
		if (paymentMethod === 'card') {
			return (
				paymentDetails.number.trim() && paymentDetails.expiry.trim() && paymentDetails.cvc.trim()
			);
		}
		if (paymentMethod === 'crypto') {
			return paymentDetails.wallet.trim() && paymentDetails.coin.trim();
		}
		if (paymentMethod === 'provider') {
			return paymentDetails.provider.trim();
		}
		return false;
	}

	function nextStep() {
		if (step === 1 && allCustomerFieldsValid()) {
			step = 2;
		} else if (step === 2 && paymentValid()) {
			handleSubmit();
		}
	}

	function prevStep() {
		if (step > 1) step -= 1;
	}

	function handleSubmit() {
		const order = {
			customer,
			payment: {
				method: paymentMethod,
				details: paymentDetails
			}
		};
		console.log('Submitting order:', order);
		// TODO: integrate with backend/payment API
		close();
	}

	onMount(() => {
		const handleKeydown = (e) => {
			if (e.key === 'Escape') close();
		};
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<div class="modal-overlay" on:click={handleOverlayClick}>
	<div class="modal" on:click|stopPropagation>
		<button class="close" on:click={close} aria-label="Close modal">✕</button>

		{#if step === 1}
			<h2 class="title">Step 1: Enter Your Information</h2>
			<p class="subtitle">Please fill in all required fields to continue.</p>
			<CustomerInfoForm {customer} />
		{:else if step === 2}
			<h2 class="title">Step 2: Select Payment Method</h2>
			<p class="subtitle">Choose your preferred payment option and complete payment.</p>
			<PaymentForm bind:paymentMethod bind:paymentDetails />
		{/if}

		<div class="actions">
			{#if step > 1}
				<button type="button" class="secondary" on:click={prevStep}>Back</button>
			{/if}
			<button
				type="button"
				class="primary"
				on:click={nextStep}
				disabled={step === 1 ? !allCustomerFieldsValid() : !paymentValid()}
			>
				{step === 1 ? 'Continue' : 'Pay Now'}
			</button>
		</div>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.modal {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		max-width: 450px;
		width: 90%;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		position: relative;
		animation: fadeIn 0.3s ease-out;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.title {
		font-size: 1.35rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.subtitle {
		font-size: 0.9rem;
		color: #6b7280;
		margin-bottom: 0.75rem;
	}

	.close {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.primary {
		background: #ff6f61;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.3s;
		font-weight: 600;
	}
	.primary:hover:enabled {
		background: #ff4a3d;
	}
	.primary:disabled {
		background: #fca5a5;
		cursor: not-allowed;
	}

	.secondary {
		background: #f3f4f6;
		color: #374151;
		border: none;
		padding: 0.75rem 1.25rem;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 500;
	}
	.secondary:hover {
		background: #e5e7eb;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
