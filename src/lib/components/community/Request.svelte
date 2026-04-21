<script>
	import { requestCommunityAccess } from '$lib/client/community.js';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('community.request.component');

	let {
		email = '',
		firstName = '',
		source = 'community_page'
	} = $props();

	let submitted = $state(false);
	let loading = $state(false);
	let error = $state('');
	let successMessage = $state('');

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		loading = true;

		try {
			const result = await requestCommunityAccess({
				email,
				firstName,
				source
			});

			submitted = true;
			successMessage = result.message || 'Your request has been received.';
		} catch (submitError) {
			error = submitError.message || 'We could not submit your request right now.';
		} finally {
			loading = false;
		}
	}
</script>

<section class="request-card" aria-labelledby="community-access-request-title">
	{#if submitted}
		<p class="request-kicker success">Request received</p>
		<h3 id="community-access-request-title">We have your access request.</h3>
		<p>{successMessage}</p>
	{:else}
		<p class="request-kicker">Request Access</p>
		<h3 id="community-access-request-title">Ask for Community access.</h3>
		<p>
			If you want the deeper layer, submit your email here. This creates a real access request we can
			grant or revoke administratively.
		</p>

		<form class="request-form" onsubmit={handleSubmit}>
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
				{loading ? 'Submitting...' : 'Request Access'}
			</button>
		</form>

		{#if error}
			<p class="request-error">{error}</p>
		{/if}
	{/if}
</section>

<style>
	.request-card {
		padding: 1.5rem;
		border-radius: 1.8rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.18), transparent 55%),
			linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
		color: white;
		box-shadow: 0 24px 56px rgba(0, 0, 0, 0.18);
	}

	.request-kicker {
		margin: 0 0 0.8rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.9);
	}

	.request-kicker.success {
		color: rgba(3, 140, 37, 0.9);
	}

	h3 {
		margin: 0;
		font-size: clamp(1.5rem, 2.4vw, 2.2rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
	}

	p {
		margin: 0.95rem 0 0;
		font-size: 0.96rem;
		line-height: 1.72;
		color: rgba(255, 248, 239, 0.78);
	}

	.request-form {
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
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.08);
		padding: 0 1rem;
		color: white;
	}

	input::placeholder {
		color: rgba(255, 255, 255, 0.42);
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

	.request-error {
		color: #ffb5c1;
	}
</style>
