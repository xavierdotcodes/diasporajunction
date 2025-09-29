<script>
	import CheckoutModal from '$lib/payment/CheckoutModal.svelte';
	let showModal = false;
</script>

<section class="cta">
	<h2>Ready to transform your sound experience?</h2>
	<p>
		Join thousands already upgrading their lifestyle with
		<strong>
			SP<span class="triangle">
				<svg viewBox="0 0 100 100">
					<polygon points="50,0 100,100 0,100" fill="currentColor" />
				</svg>
			</span>CE
		</strong>.
	</p>
	<button class="cta-button" on:click={() => (showModal = true)}>Pre-Order Now</button>

	{#if showModal}
		<CheckoutModal on:close={() => (showModal = false)} />
	{/if}
</section>

<style>
	.cta {
		text-align: center;
		padding: 5rem 2rem;
		background: linear-gradient(135deg, #d9042b, #038c25);
		color: #fff;
		border-radius: 2rem;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		transition: transform 0.3s ease;
	}

	.cta:hover {
		transform: translateY(-4px);
	}

	.cta h2 {
		font-size: clamp(2rem, 4vw, 2.5rem);
		font-weight: 800;
		letter-spacing: 1px;
	}

	.cta p {
		font-size: 1.2rem;
		line-height: 1.6;
		max-width: 600px;
	}

	.cta strong {
		font-weight: 900;
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
	}

	.triangle {
		display: inline-block;
		width: 1em;
		height: 1em;
		margin: 0 0.05em;
		transform: translateY(-0.05em);
	}

	.triangle svg {
		width: 1em;
		height: 1em;
		fill: currentColor;
	}

	.cta-button {
		background: #fff;
		color: #d9042b;
		font-size: 1.15rem;
		font-weight: 700;
		padding: 1rem 3rem;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
	}

	.cta-button:hover {
		transform: scale(1.05);
		background: #f0f0f0;
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
	}

	.cta-button:active {
		transform: scale(0.98);
		box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
	}
</style>
