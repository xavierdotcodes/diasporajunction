<script>
	import { redirectAfterSupabaseAuth } from '$lib/client/auth';
	import SupabaseOAuthButtons from '$lib/components/auth/SupabaseOAuthButtons.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { getSupabaseBrowserClient } from '$lib/supabase/client';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('free.login.page');

	let { data } = $props();
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(event) {
		event.preventDefault();
		error = '';

		const supabase = getSupabaseBrowserClient();
		if (!supabase) {
			error = 'Supabase auth is not configured yet.';
			return;
		}

		loading = true;

		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		loading = false;

		if (authError) {
			error = authError.message;
			return;
		}

		await redirectAfterSupabaseAuth(data.next || '/housing/owners');
	}
</script>

<section class="auth-shell">
	<div class="auth-card">
		<p class="eyebrow">Owner Sign In</p>
		<h1>Sign in to manage your Ghana property listing.</h1>
		<p class="copy">
			Use your owner account to create listing drafts, upload photos, pay the submission fee, and see
			where each listing stands.
		</p>

		{#if !data.supabaseConfigured}
			<p class="status error">Supabase auth is not configured yet. Add the public Supabase env vars first.</p>
		{:else}
			<form class="auth-form" onsubmit={handleLogin}>
				<label>
					<span>Email</span>
					<input type="email" bind:value={email} autocomplete="email" required />
				</label>
				<label>
					<span>Password</span>
					<input type="password" bind:value={password} autocomplete="current-password" required />
				</label>

				{#if error}
					<p class="status error">{error}</p>
				{/if}

				<Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
					{loading ? 'Signing In...' : 'Sign In'}
				</Button>
			</form>

			<SupabaseOAuthButtons next={data.next} label="Or continue with" />
		{/if}

		<p class="meta">
			Need an owner account?
			<a href={`/signup?next=${encodeURIComponent(data.next || '/housing/owners')}`}>Create one</a>
		</p>
	</div>
</section>

<style>
	.auth-shell {
		min-height: calc(100vh - 10rem);
		display: grid;
		place-items: center;
		padding: 2rem 1.25rem 4rem;
		background:
			radial-gradient(circle at top left, rgba(242, 183, 5, 0.22), transparent 28rem),
			linear-gradient(180deg, #f8f2df 0%, #f4ead1 100%);
	}

	.auth-card {
		width: min(100%, 34rem);
		padding: clamp(1.6rem, 4vw, 2.4rem);
		border-radius: 2rem;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 24px 60px rgba(17, 17, 17, 0.12);
	}

	.eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(217, 4, 43, 0.82);
	}

	h1 {
		margin: 0.8rem 0 0;
		font-size: clamp(2rem, 4vw, 3rem);
		line-height: 0.96;
		letter-spacing: -0.05em;
	}

	.copy {
		margin: 1rem 0 0;
		line-height: 1.7;
		color: rgba(17, 17, 17, 0.74);
	}

	.auth-form {
		display: grid;
		gap: 0.95rem;
		margin-top: 1.5rem;
	}

	label {
		display: grid;
		gap: 0.45rem;
	}

	label span {
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: rgba(17, 17, 17, 0.6);
	}

	input {
		min-height: 3.1rem;
		padding: 0 1rem;
		border-radius: 999px;
		border: 1px solid rgba(17, 17, 17, 0.12);
		background: #fff;
	}

	.status {
		margin: 0;
		font-size: 0.95rem;
	}

	.status.error {
		color: #b10323;
	}

	.meta {
		margin: 1rem 0 0;
		font-size: 0.95rem;
		color: rgba(17, 17, 17, 0.72);
	}

	.meta a {
		color: #026b1d;
		font-weight: 700;
		text-decoration: none;
	}
</style>
