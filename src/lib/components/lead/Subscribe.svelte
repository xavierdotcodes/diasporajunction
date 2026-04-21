<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { page } from '$app/state';
	import { subscribe } from '$lib/client/leads.js';
	import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
	import { gsap } from 'gsap';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('lead.subscribe.component');

	const dispatch = createEventDispatcher();

	let backdropEl = $state();
	let panelEl = $state();
	let emailInputEl = $state();

	let email = $state('');
	let name = $state('');
	let error = $state('');
	let success = $state(false);
	let submitting = $state(false);

	function handleEscape(event) {
		if (event.key === 'Escape') {
			event.preventDefault();
			closeModal();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleEscape);

		if (backdropEl && panelEl) {
			gsap.fromTo(
				backdropEl,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.35, ease: 'power2.out' }
			);
			gsap.fromTo(
				panelEl,
				{ y: 40, opacity: 0, scale: 0.96 },
				{ y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out' }
			);
		}

		emailInputEl?.focus();

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	});

	async function closeModal() {
		if (!backdropEl || !panelEl) {
			dispatch('close');
			return;
		}

		const tl = gsap.timeline({
			onComplete: () => dispatch('close')
		});

		tl.to(panelEl, {
			y: -24,
			opacity: 0,
			scale: 0.97,
			duration: 0.28,
			ease: 'power2.inOut'
		}).to(
			backdropEl,
			{
				opacity: 0,
				duration: 0.22,
				ease: 'power1.in'
			},
			'-=0.12'
		);
	}

	async function submitForm() {
		error = '';

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			error = 'Please enter a valid email address.';
			return;
		}

		submitting = true;

		try {
			await subscribe(email, name, {
				source: 'newsletter_modal',
				leadMagnet: DEFAULT_LEAD_MAGNET_NAME,
				entryPage: page.url.pathname
			});

			success = true;

			if (panelEl) {
				gsap.fromTo(
					panelEl,
					{ scale: 1 },
					{ scale: 1.015, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut' }
				);
			}

			setTimeout(() => {
				closeModal();
			}, 1400);
		} catch (err) {
			error = err.message || 'Something went wrong.';
		} finally {
			submitting = false;
		}
	}
</script>

<div
	class="modal-backdrop"
	role="presentation"
	bind:this={backdropEl}
	onclick={closeModal}
>
	<div
		class="modal-panel"
		role="dialog"
		aria-modal="true"
		aria-labelledby="subscribe-modal-title"
		aria-describedby="subscribe-modal-description"
		tabindex="-1"
		bind:this={panelEl}
		onclick={(event) => event.stopPropagation()}
		onkeydown={(event) => event.stopPropagation()}
	>
		<button class="close-btn" type="button" onclick={closeModal} aria-label="Close subscribe modal">
			<span aria-hidden="true">×</span>
		</button>

		<div class="modal-grid">
			<div class="modal-story">
				<p class="modal-eyebrow">Start Here</p>
				<h3 id="subscribe-modal-title">Get the Free Ghana Reality Guide</h3>
				<p id="subscribe-modal-description" class="modal-copy">
					Start with something grounded. We will send <strong>{DEFAULT_LEAD_MAGNET_NAME}</strong>
					first, then a short sequence on relocation, belonging, and entering Ghana with more
					context.
				</p>

				<div class="modal-image-wrap">
					<img src="/images/keys.jpg" alt="Keys on a table" class="modal-image" />
					<div class="modal-image-overlay" aria-hidden="true"></div>
					<div class="modal-image-caption">
						<p>Clarity before relocation. Guidance before guesswork.</p>
					</div>
				</div>
			</div>

			<div class="modal-form-wrap">
				<div class="modal-form-header">
					<p class="modal-form-kicker">What you receive</p>
					<ul class="modal-benefits">
						<li>The guide immediately</li>
						<li>A short relocation sequence</li>
						<li>A clearer entry into DiasporaJunxion</li>
					</ul>
				</div>

				<form class="modal-form" onsubmit={(event) => {
					event.preventDefault();
					submitForm();
				}}>
					<label class="field">
						<span>Your name</span>
						<input
							type="text"
							bind:value={name}
							placeholder="Optional"
							autocomplete="name"
						/>
					</label>

					<label class="field">
						<span>Your email</span>
						<input
							type="email"
							bind:value={email}
							bind:this={emailInputEl}
							placeholder="you@example.com"
							autocomplete="email"
							required
						/>
					</label>

					{#if error}
						<p class="status-error" role="alert">{error}</p>
					{/if}

					<button class="submit-btn" type="submit" disabled={submitting}>
						{#if submitting}
							Sending...
						{:else}
							Get the Guide
						{/if}
					</button>

					{#if success}
						<p class="status-success" role="status">Check your email for the guide.</p>
					{/if}

					<p class="modal-footnote">
						No spam. No generic newsletter blast. Just a grounded starting point.
					</p>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background:
			linear-gradient(180deg, rgba(17, 17, 17, 0.52), rgba(17, 17, 17, 0.76)),
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.16), transparent 32rem),
			radial-gradient(circle at bottom right, rgba(217, 4, 43, 0.16), transparent 26rem);
		backdrop-filter: blur(8px);
		z-index: 50;
	}

	.modal-panel {
		position: relative;
		width: min(100%, 64rem);
		border-radius: 2rem;
		overflow: hidden;
		background:
			linear-gradient(180deg, #fff8ef 0%, #f6eddb 100%);
		box-shadow:
			0 36px 90px rgba(0, 0, 0, 0.28),
			inset 0 1px 0 rgba(255, 255, 255, 0.62);
		color: #111111;
		transform-origin: center;
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 3;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border: none;
		border-radius: 999px;
		background: rgba(17, 17, 17, 0.08);
		color: #111111;
		font-size: 1.65rem;
		cursor: pointer;
		transition:
			transform 180ms ease,
			background-color 180ms ease;
	}

	.close-btn:hover {
		transform: translateY(-1px);
		background: rgba(17, 17, 17, 0.14);
	}

	.modal-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.02fr) minmax(20rem, 0.88fr);
		min-height: 38rem;
	}

	.modal-story {
		padding: clamp(1.5rem, 4vw, 2.6rem);
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.22), transparent 48%),
			linear-gradient(180deg, #fff6de 0%, #f7ead0 100%);
	}

	.modal-eyebrow,
	.modal-form-kicker {
		margin: 0 0 0.95rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.26em;
		text-transform: uppercase;
	}

	.modal-eyebrow {
		color: rgba(17, 17, 17, 0.64);
	}

	.modal-story h3 {
		margin: 0;
		font-size: clamp(2rem, 4vw, 3.5rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}

	.modal-copy {
		margin: 1.1rem 0 0;
		max-width: 31rem;
		font-size: 1rem;
		line-height: 1.78;
		color: rgba(17, 17, 17, 0.78);
	}

	.modal-image-wrap {
		position: relative;
		margin-top: 1.75rem;
		min-height: 18rem;
		border-radius: 1.7rem;
		overflow: hidden;
		box-shadow: 0 20px 50px rgba(121, 86, 11, 0.15);
	}

	.modal-image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.modal-image-overlay {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.54)),
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.22), transparent 45%);
	}

	.modal-image-caption {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		max-width: 16rem;
		padding: 0.95rem 1rem;
		border-radius: 1.2rem;
		background: rgba(17, 17, 17, 0.76);
		color: white;
		backdrop-filter: blur(10px);
	}

	.modal-image-caption p {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.55;
	}

	.modal-form-wrap {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: clamp(1.5rem, 4vw, 2.3rem);
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.12), transparent 38%),
			linear-gradient(180deg, #111111 0%, #1b1b1b 100%);
		color: white;
	}

	.modal-form-kicker {
		color: rgba(242, 183, 5, 0.9);
	}

	.modal-benefits {
		list-style: none;
		display: grid;
		gap: 0.8rem;
		margin: 0;
		padding: 0;
	}

	.modal-benefits li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.96rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.82);
	}

	.modal-benefits li::before {
		content: '';
		display: inline-flex;
		flex: 0 0 auto;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 999px;
		background: #038c25;
		box-shadow: 0 0 0 0.25rem rgba(3, 140, 37, 0.16);
	}

	.modal-form {
		display: grid;
		gap: 0.95rem;
		margin-top: 1.6rem;
	}

	.field {
		display: grid;
		gap: 0.4rem;
	}

	.field span {
		font-size: 0.86rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.76);
	}

	.field input {
		width: 100%;
		min-height: 3.25rem;
		padding: 0 1rem;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.06);
		color: white;
		transition:
			border-color 180ms ease,
			background-color 180ms ease,
			box-shadow 180ms ease;
	}

	.field input::placeholder {
		color: rgba(255, 255, 255, 0.4);
	}

	.field input:focus {
		outline: none;
		border-color: rgba(242, 183, 5, 0.56);
		background: rgba(255, 255, 255, 0.1);
		box-shadow: 0 0 0 0.2rem rgba(242, 183, 5, 0.12);
	}

	.submit-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 3.45rem;
		margin-top: 0.2rem;
		padding: 0 1.3rem;
		border: none;
		border-radius: 999px;
		background: linear-gradient(135deg, #d9042b, #b10323);
		color: white;
		font-size: 0.98rem;
		font-weight: 700;
		cursor: pointer;
		transition:
			transform 180ms ease,
			box-shadow 180ms ease,
			filter 180ms ease;
		box-shadow: 0 18px 38px rgba(95, 0, 18, 0.24);
	}

	.submit-btn:hover:enabled {
		transform: translateY(-1px);
		filter: brightness(1.02);
	}

	.submit-btn:disabled {
		cursor: wait;
		opacity: 0.8;
	}

	.status-error,
	.status-success,
	.modal-footnote {
		margin: 0;
	}

	.status-error {
		font-size: 0.92rem;
		line-height: 1.6;
		color: #ffb9c5;
	}

	.status-success {
		font-size: 0.92rem;
		line-height: 1.6;
		color: #a9f4bb;
	}

	.modal-footnote {
		font-size: 0.86rem;
		line-height: 1.68;
		color: rgba(255, 255, 255, 0.56);
	}

	@media (max-width: 900px) {
		.modal-grid {
			grid-template-columns: 1fr;
		}

		.modal-panel {
			max-height: min(92vh, 52rem);
			overflow: auto;
		}
	}

	@media (max-width: 768px) {
		.modal-backdrop {
			padding: 0.75rem;
		}

		.modal-panel {
			border-radius: 1.5rem;
		}

		.modal-story,
		.modal-form-wrap {
			padding: 1.2rem;
		}

		.modal-story h3 {
			font-size: clamp(1.8rem, 9vw, 2.5rem);
		}

		.modal-image-wrap {
			min-height: 14rem;
			border-radius: 1.25rem;
		}

		.modal-image-caption {
			left: 0.85rem;
			right: 0.85rem;
			max-width: none;
		}
	}
</style>
