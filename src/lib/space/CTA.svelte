<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function openModal() {
		dispatch('openModal');
	}
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
	<button class="cta-button" on:click={openModal}>Pre-Order Now</button>
</section>

<style>
	.cta {
		text-align: center;
		padding: 3rem 1rem;
		background: linear-gradient(135deg, #1e1e2f, #2d2d44);
		color: white;
		border-radius: 1rem;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
	}

	.cta h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.cta p {
		font-size: 1.2rem;
		margin-bottom: 1.5rem;
	}

	.cta-button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border: none;
		border-radius: 0.5rem;
		background: #ff6f61;
		color: white;
		cursor: pointer;
		transition: background 0.3s;
	}

	.cta-button:hover {
		background: #ff4a3d;
	}

	.triangle {
		display: inline-block;
		width: 1em;
		height: 1em;
		vertical-align: middle;
	}
</style>
