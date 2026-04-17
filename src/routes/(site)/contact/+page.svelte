<script>
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('src/routes/(site)/contact/+page.svelte');

	let formData = $state({ name: '', email: '', message: '', honey: '' }); // added honey
	let success = $state(false);
	let error = $state(false);
	let errorMessage = $state('');

	async function handleSubmit(e) {
		e.preventDefault();

		// Client-side validation
		if (formData.honey.trim() !== '') {
			error = true;
			errorMessage = 'Bot detected.';
			return;
		}

		if (!formData.name || formData.name.length < 2 || formData.name.length > 50) {
			error = true;
			errorMessage = 'Name must be between 2 and 50 characters.';
			return;
		}

		if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			error = true;
			errorMessage = 'Please provide a valid email address.';
			return;
		}

		if (!formData.message || formData.message.length < 10 || formData.message.length > 1000) {
			error = true;
			errorMessage = 'Message must be between 10 and 1000 characters.';
			return;
		}

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			const data = await res.json();

			if (data.success) {
				success = true;
				error = false;
				errorMessage = '';
				formData = { name: '', email: '', message: '', honey: '' };
			} else {
				throw new Error(data.error || 'Unknown error');
			}
		} catch (err) {
			console.error(err);
			success = false;
			error = true;
			errorMessage = '⚠️ Something went wrong. Please try again.';
		}
	}
</script>

<section class="contact">
	<div class="container">
		<h1 class="title">Contact Us</h1>
		<p class="subtitle">
			We’d love to hear from you. Send us a message or connect on social media.
		</p>

		<form onsubmit={handleSubmit} class="contact-form" novalidate>
			<label>
				<span>Name</span>
				<input type="text" bind:value={formData.name} required minlength="2" maxlength="50" />
			</label>

			<label>
				<span>Email</span>
				<input type="email" bind:value={formData.email} required maxlength="100" />
			</label>

			<label>
				<span>Message</span>
				<textarea rows="5" bind:value={formData.message} required minlength="10" maxlength="1000"
				></textarea>
			</label>

			<!-- Honeypot field (hidden from users) -->
			<input
				type="text"
				bind:value={formData.honey}
				tabindex="-1"
				autocomplete="off"
				class="hidden-honey"
			/>

			<button type="submit">Send Message</button>
		</form>

		{#if success}
			<p class="success">✅ Your message has been sent to Discord. Thank you!</p>
		{:else if error}
			<p class="error">{errorMessage}</p>
		{/if}
	</div>
</section>

<style>
	.contact {
		padding: 3rem 1rem;
		display: flex;
		justify-content: center;
	}

	.container {
		width: 100%;
		max-width: 700px;
		text-align: center;
	}

	.title {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1rem;
		color: #555;
		margin-bottom: 2rem;
		padding: 0 0.5rem;
	}

	.contact-form {
		display: grid;
		gap: 1rem;
		margin-bottom: 2rem;
		text-align: left;
	}

	label {
		display: flex;
		flex-direction: column;
		font-size: 0.9rem;
		color: #333;
	}

	input,
	textarea {
		margin-top: 0.5rem;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		font-size: 1rem;
		width: 100%;
		box-sizing: border-box;
	}

	button {
		background: #008e30;
		color: #fff;
		padding: 0.75rem;
		font-size: 1rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.1s;
		width: 100%;
	}

	button:hover {
		background: #006e25;
		transform: scale(1.02);
	}

	.success {
		color: #008e30;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}

	.error {
		color: #d93025;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}

	.hidden-honey {
		display: none !important;
		visibility: hidden;
		height: 0;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.title {
			font-size: 1.7rem;
		}

		.subtitle {
			font-size: 0.95rem;
		}

		.contact-form {
			gap: 0.8rem;
		}

		input,
		textarea {
			padding: 0.65rem;
		}

		button {
			padding: 0.65rem;
			font-size: 0.95rem;
		}
	}
</style>
