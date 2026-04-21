<script>
	import { EBOOK_PRICE_USD } from '$lib/ebook/config';
	import { startEbookCheckout } from '$lib/client/ebook.js';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('ebook.checkout.component');

	let {
		email = '',
		firstName = '',
		source = 'ebook_checkout'
	} = $props();

	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		loading = true;

		try {
			const { url } = await startEbookCheckout({
				email,
				firstName,
				source
			});

			window.location.href = url;
		} catch (submitError) {
			error = submitError.message || 'We could not start ebook checkout right now.';
			loading = false;
		}
	}
</script>

<section class="checkout-card" aria-labelledby="ebook-checkout-title">
	<p class="checkout-kicker">Buy The Ebook</p>
	<h3 id="ebook-checkout-title">Purchase the deeper family guide.</h3>
	<p class="checkout-copy">
		This is the paid layer for people who want a more structured family-oriented lens on moving,
		settling, and building rhythm in Ghana.
	</p>

	<div class="checkout-price-row">
		<span>Digital purchase</span>
		<strong>${EBOOK_PRICE_USD}</strong>
	</div>

	<form class="checkout-form" onsubmit={handleSubmit}>
		<input
			type="text"
			name="firstName"
			bind:value={firstName}
			placeholder="First name (optional)"
			autocomplete="given-name"
		/>
		<input
			type="email"
			name="email"
			bind:value={email}
			placeholder="Email address"
			required
			autocomplete="email"
		/>
		<button type="submit" disabled={loading}>
			{loading ? 'Redirecting...' : `Checkout $${EBOOK_PRICE_USD}`}
		</button>
	</form>

	{#if error}
		<p class="checkout-error">{error}</p>
	{/if}
</section>

<style>
	.checkout-card {
		padding: 1.6rem;
		border-radius: 1.9rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.22), transparent 52%),
			linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		color: #111111;
		box-shadow: 0 22px 48px rgba(0, 0, 0, 0.1);
	}

	.checkout-kicker {
		margin: 0 0 0.8rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(217, 4, 43, 0.88);
	}

	h3 {
		margin: 0;
		font-size: clamp(1.6rem, 2.4vw, 2.3rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
	}

	.checkout-copy {
		margin: 0.95rem 0 0;
		font-size: 0.98rem;
		line-height: 1.75;
		color: rgba(17, 17, 17, 0.76);
	}

	.checkout-price-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.15rem;
		padding: 0.95rem 0;
		border-top: 1px solid rgba(17, 17, 17, 0.08);
		border-bottom: 1px solid rgba(17, 17, 17, 0.08);
	}

	.checkout-price-row span {
		font-size: 0.94rem;
		color: rgba(17, 17, 17, 0.64);
	}

	.checkout-price-row strong {
		font-size: 1.2rem;
	}

	.checkout-form {
		display: grid;
		gap: 0.75rem;
		margin-top: 1.2rem;
	}

	input,
	button {
		min-height: 3rem;
		border-radius: 999px;
	}

	input {
		border: 1px solid rgba(17, 17, 17, 0.12);
		background: white;
		padding: 0 1rem;
		color: #111111;
	}

	button {
		border: 0;
		background: linear-gradient(135deg, #d9042b, #b10323);
		color: white;
		font-size: 0.94rem;
		font-weight: 700;
	}

	button:disabled {
		opacity: 0.7;
	}

	.checkout-error {
		margin: 0.9rem 0 0;
		font-size: 0.92rem;
		color: #b10323;
	}
</style>
