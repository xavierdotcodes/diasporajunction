<script>
	import { createEventDispatcher } from 'svelte';
	import { subscribe } from '$lib/client/helpers';
	import { gsap } from 'gsap';

	const dispatch = createEventDispatcher();

	let email = '';
	let name = '';
	let error = '';
	let success = false;

	async function submitForm() {
		error = '';
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			error = 'Please enter a valid email';
			return;
		}

		try {
			await subscribe(email, name);
			success = true;

			// Animate out modal after success
			gsap.to('.modal-content', {
				y: -50,
				opacity: 0,
				duration: 0.5,
				onComplete: () => dispatch('close')
			});
		} catch (err) {
			error = err.message;
		}
	}
</script>

<div class="modal-backdrop" on:click={() => dispatch('close')}>
	<div class="modal-content" on:click|stopPropagation>
		<button class="close-btn" on:click={() => dispatch('close')}>✕</button>

		<!-- Image -->
		<img src="/images/keys-to-africa.jpg" alt="Subscribe" class="modal-image" />

		<h3 class="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
		<p class="text-sm mb-4">Stay updated with DiasporaJunxion news and events.</p>

		{#if error}
			<p class="text-red-500 mb-2">{error}</p>
		{/if}

		<input type="text" bind:value={name} placeholder="Your Name (optional)" class="name-input" />
		<input type="email" bind:value={email} placeholder="Your Email" class="email-input" />

		<button class="submit-btn" on:click={submitForm}>Subscribe</button>
		{#if success}
			<p class="text-green-400 mt-2">Subscribed successfully!</p>
		{/if}
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 50;
	}

	.modal-content {
		background: #111;
		padding: 2rem;
		border-radius: 1rem;
		text-align: center;
		width: 90%;
		max-width: 500px;
		position: relative;
	}

	.modal-image {
		margin: 0 auto 1rem auto;
		border-radius: 1rem;
	}

	.close-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		color: #fff;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.name-input,
	.email-input {
		width: 100%;
		padding: 0.75rem;
		margin-bottom: 0.75rem;
		border-radius: 0.5rem;
		border: 1px solid #555;
		background: #222;
		color: #fff;
	}

	.submit-btn {
		background: #d9042b;
		color: #fff;
		font-weight: 700;
		padding: 0.75rem;
		border-radius: 9999px;
		cursor: pointer;
		width: 100%;
		transition: 0.25s;
	}
	.submit-btn:hover {
		background: #b50323;
	}
</style>
