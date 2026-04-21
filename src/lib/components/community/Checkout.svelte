<script>
	import { COMMUNITY_ACCESS_PRICE_USD } from '$lib/community/config';
	import { startCommunityCheckout } from '$lib/client/community.js';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('community.checkout.component');

	let {
		email = '',
		firstName = '',
		source = 'community_checkout'
	} = $props();

	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		loading = true;

		try {
			const { url } = await startCommunityCheckout({
				email,
				firstName,
				source
			});

			window.location.href = url;
		} catch (submitError) {
			error = submitError.message || 'We could not start checkout right now.';
			loading = false;
		}
	}
</script>

<section class="checkout-card" aria-labelledby="community-checkout-title">
	<p class="checkout-kicker">Buy Access</p>
	<h3 id="community-checkout-title">Activate Community now.</h3>
	<p class="checkout-copy">
		Use Stripe Checkout for immediate activation. Once payment completes, Community access will be
		turned on for this email automatically.
	</p>

	<div class="checkout-price-row">
		<span>One-time payment</span>
		<strong>${COMMUNITY_ACCESS_PRICE_USD}</strong>
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
			{loading ? 'Redirecting...' : `Checkout $${COMMUNITY_ACCESS_PRICE_USD}`}
		</button>
	</form>

	{#if error}
		<p class="checkout-error">{error}</p>
	{/if}
</section>

<style>
	.checkout-card {
		padding: 1.5rem;
		border-radius: 1.8rem;
		background:
			radial-gradient(circle at top left, rgba(3, 140, 37, 0.16), transparent 55%),
			linear-gradient(180deg, #fff8ef 0%, #f5ead3 100%);
		color: #111111;
		box-shadow: 0 20px 46px rgba(0, 0, 0, 0.1);
	}

	.checkout-kicker {
		margin: 0 0 0.8rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(3, 140, 37, 0.88);
	}

	h3 {
		margin: 0;
		font-size: clamp(1.5rem, 2.4vw, 2.2rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
	}

	.checkout-copy {
		margin: 0.95rem 0 0;
		font-size: 0.96rem;
		line-height: 1.72;
		color: rgba(17, 17, 17, 0.76);
	}

	.checkout-price-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.1rem;
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
