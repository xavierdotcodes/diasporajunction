<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { subscribe } from '$lib/client/helpers';
	import { gsap } from 'gsap';

	const dispatch = createEventDispatcher();

	let email = '';
	let name = '';
	let error = '';
	let success = false;

	// Animate modal in on mount
	onMount(() => {
		gsap.fromTo(
			'.modal-backdrop',
			{ opacity: 0 },
			{ opacity: 1, duration: 0.4, ease: 'power2.out' }
		);
		gsap.fromTo(
			'.modal-content',
			{ y: 50, opacity: 0, scale: 0.9 },
			{ y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
		);
	});

	async function closeModal() {
		// animate out
		const tl = gsap.timeline({
			onComplete: () => dispatch('close')
		});
		tl.to('.modal-content', {
			y: -50,
			opacity: 0,
			scale: 0.95,
			duration: 0.4,
			ease: 'power2.inOut'
		}).to('.modal-backdrop', {
			opacity: 0,
			duration: 0.3,
			ease: 'power1.in'
		});
	}

	async function submitForm() {
		error = '';
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			error = 'Please enter a valid email';
			return;
		}

		try {
			await subscribe(email, name);
			success = true;

			// success pulse
			gsap.fromTo(
				'.modal-content',
				{ scale: 1 },
				{ scale: 1.03, duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.inOut' }
			);

			setTimeout(closeModal, 1500);
		} catch (err) {
			error = err.message || 'Something went wrong.';
		}
	}
</script>

<div class="modal-backdrop" on:click={closeModal}>
	<div class="modal-content" on:click|stopPropagation>
		<button class="close-btn" on:click={closeModal}>✕</button>

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
		backdrop-filter: blur(4px);
	}

	.modal-content {
		background: #111;
		padding: 2rem;
		border-radius: 1rem;
		text-align: center;
		width: 90%;
		max-width: 500px;
		position: relative;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
		transform-origin: center;
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
		opacity: 0.8;
		transition: opacity 0.2s;
	}
	.close-btn:hover {
		opacity: 1;
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
		transition: background 0.25s;
	}
	.submit-btn:hover {
		background: #b50323;
	}
</style>
