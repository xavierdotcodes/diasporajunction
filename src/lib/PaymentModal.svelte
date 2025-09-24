<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let showModal = false;

	// Example products info for pre-order
	const product = {
		name: 'SP△CE Mini Speaker',
		priceUSD: 199
	};

	function openModal() {
		showModal = true;

		// Animate modal in
		gsap.fromTo(
			'.modal-content',
			{ y: 50, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
		);

		gsap.fromTo('.overlay', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power3.out' });
	}

	function closeModal() {
		// Animate modal out
		gsap.to('.modal-content', {
			y: 50,
			opacity: 0,
			duration: 0.4,
			ease: 'power3.in',
			onComplete: () => (showModal = false)
		});

		gsap.to('.overlay', { opacity: 0, duration: 0.4, ease: 'power3.in' });
	}

	function payWithStripe() {
		alert('Stripe Checkout placeholder');
		// integrate Stripe Checkout or redirect here
	}

	function payWithMoMo() {
		alert('MoMo Payment placeholder');
		// integrate MoMo API here
	}

	function payWithCrypto() {
		alert('Crypto Payment placeholder');
		// show wallet address or payment widget
	}
</script>

<!-- Pre-Order Button -->
<button class="cta-button" on:click={openModal}>Pre-Order Now</button>

{#if showModal}
	<!-- Overlay -->
	<div class="overlay" on:click={closeModal}></div>

	<!-- Modal Content -->
	<div class="modal-content">
		<h2>Pre-Order {product.name}</h2>
		<p>Price: ${product.priceUSD}</p>

		<div class="payment-options">
			<button on:click={payWithStripe}>Pay with Stripe</button>
			<button on:click={payWithMoMo}>Pay with MoMo</button>
			<button on:click={payWithCrypto}>Pay with Crypto</button>
		</div>

		<button class="close-btn" on:click={closeModal}>✕</button>
	</div>
{/if}

<style>
	/* Overlay */
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	/* Modal */
	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 3rem;
		border-radius: 1rem;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
		width: 90%;
		max-width: 500px;
		text-align: center;
		z-index: 1001;
	}

	.modal-content h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.payment-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 2rem 0;
	}

	.payment-options button {
		padding: 1rem;
		font-size: 1rem;
		font-weight: bold;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.payment-options button:hover {
		transform: scale(1.05);
	}

	.payment-options button:nth-child(1) {
		background: #6772e5;
		color: white;
	}
	.payment-options button:nth-child(2) {
		background: #00b87c;
		color: white;
	}
	.payment-options button:nth-child(3) {
		background: #f7931a;
		color: white;
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}
</style>
