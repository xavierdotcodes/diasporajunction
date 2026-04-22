<script>
	let { data, form } = $props();

	const errorMessage = $derived(form?.error ?? null);
	const emailValue = $derived(form?.email ?? '');
	const next = $derived(form?.next ?? data.next ?? '/admin/housing');
</script>

<svelte:head>
	<title>Admin Login | DiasporaJunxion</title>
	<meta
		name="description"
		content="Secure admin login for DiasporaJunxion operations and housing moderation."
	/>
</svelte:head>

<section class="admin-login-shell">
	<div class="admin-login-card">
		<p class="eyebrow">DiasporaJunxion Admin</p>
		<h1>Admin Login</h1>
		<p class="intro">
			Use the admin account to review housing submissions, moderate listings, and handle internal
			operations.
		</p>

		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{/if}

		<form method="POST" action="?/login" class="admin-login-form">
			<input type="hidden" name="next" value={next} />

			<label>
				<span>Email</span>
				<input
					type="email"
					name="email"
					required
					autocomplete="username"
					value={emailValue}
					placeholder="Enter your admin email"
				/>
			</label>

			<label>
				<span>Password</span>
				<input
					type="password"
					name="password"
					required
					autocomplete="current-password"
					placeholder="Enter your admin password"
				/>
			</label>

			<button type="submit">Enter Admin Area</button>
		</form>

		<p class="support-copy">
			This area is for internal operations only. Owner accounts and public housing browsing use
			separate flows.
		</p>
	</div>
</section>

<style>
	.admin-login-shell {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		background:
			radial-gradient(circle at top, rgba(242, 183, 5, 0.24), transparent 34%),
			linear-gradient(180deg, #121212 0%, #050505 100%);
	}

	.admin-login-card {
		width: min(100%, 32rem);
		border-radius: 1.75rem;
		border: 1px solid rgba(242, 183, 5, 0.18);
		background: rgba(17, 17, 17, 0.94);
		padding: 2rem;
		color: #f5f1e8;
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.34);
	}

	.eyebrow {
		margin: 0 0 0.75rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(242, 183, 5, 0.78);
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5vw, 2.8rem);
		line-height: 1;
	}

	.intro {
		margin: 0.9rem 0 1.5rem;
		color: rgba(245, 241, 232, 0.78);
		line-height: 1.6;
	}

	.error-message {
		margin: 0 0 1rem;
		border-radius: 1rem;
		background: rgba(217, 4, 43, 0.12);
		padding: 0.9rem 1rem;
		color: #ffb8c4;
	}

	.admin-login-form {
		display: grid;
		gap: 1rem;
	}

	label {
		display: grid;
		gap: 0.4rem;
	}

	label span {
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(245, 241, 232, 0.82);
	}

	input {
		width: 100%;
		border-radius: 1rem;
		border: 1px solid rgba(242, 183, 5, 0.18);
		background: rgba(255, 255, 255, 0.04);
		padding: 0.95rem 1rem;
		color: #f5f1e8;
		font: inherit;
	}

	input:focus {
		outline: 2px solid #f2b705;
		outline-offset: 2px;
	}

	button {
		margin-top: 0.5rem;
		border: none;
		border-radius: 999px;
		background: #d9042b;
		padding: 0.95rem 1.25rem;
		color: white;
		font: inherit;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		cursor: pointer;
	}

	.support-copy {
		margin: 1rem 0 0;
		color: rgba(245, 241, 232, 0.62);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	@media (max-width: 640px) {
		.admin-login-card {
			padding: 1.5rem;
			border-radius: 1.4rem;
		}
	}
</style>
