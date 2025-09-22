<script>
	import Footer from '$lib/Footer.svelte';
	import { onMount } from 'svelte';
	import {
		faInstagram,
		faTiktok,
		faYoutube,
		faPinterest,
		faXTwitter,
		faFacebook,
		faLinkedin,
		faTwitch
	} from '@fortawesome/free-brands-svg-icons';

	let Fa; // Will hold svelte-fa after dynamic import
	let formData = { name: '', email: '', message: '' };
	let success = false;

	function handleSubmit(e) {
		e.preventDefault();
		console.log('Form submitted:', formData);
		success = true;
		formData = { name: '', email: '', message: '' };
	}
</script>

<section class="contact">
	<div class="container">
		<h1 class="title">Contact Us</h1>
		<p class="subtitle">
			We’d love to hear from you. Send us a message or connect on social media.
		</p>

		<form on:submit|preventDefault={handleSubmit} class="contact-form">
			<label>
				<span>Name</span>
				<input type="text" bind:value={formData.name} required />
			</label>

			<label>
				<span>Email</span>
				<input type="email" bind:value={formData.email} required />
			</label>

			<label>
				<span>Message</span>
				<textarea rows="5" bind:value={formData.message} required></textarea>
			</label>

			<button type="submit">Send Message</button>
		</form>

		{#if success}
			<p class="success">✅ Your message has been sent. Thank you!</p>
		{/if}
	</div>
</section>
<Footer />

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

	.socials {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
		gap: 1rem;
		justify-items: center;
		align-items: center;
	}

	.socials a {
		font-size: 1.8rem;
		color: #333;
		transition:
			color 0.2s,
			transform 0.2s;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: #f5f5f5;
	}

	.socials a:hover {
		color: #fff;
		background: #008e30;
		transform: scale(1.2);
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
