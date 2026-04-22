<script>
	import { redirectAfterSupabaseAuth } from '$lib/client/auth';
	import SupabaseOAuthButtons from '$lib/components/auth/SupabaseOAuthButtons.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { getSupabaseBrowserClient } from '$lib/supabase/client';
	import { fileLogger } from '$lib/utils/logger';

	fileLogger('free.signup.page');

	let { data } = $props();
	let firstName = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let notice = $state('');
	let loading = $state(false);

	async function handleSignup(event) {
		event.preventDefault();
		error = '';
		notice = '';

		const supabase = getSupabaseBrowserClient();
		if (!supabase) {
			error = 'Supabase auth is not configured yet.';
			return;
		}

		loading = true;

		const { data: signupData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(data.next || '/housing/owners')}`,
				data: {
					first_name: firstName || null
				}
			}
		});

		loading = false;

		if (authError) {
			error = authError.message;
			return;
		}

		if (signupData.session) {
			await redirectAfterSupabaseAuth(data.next || '/housing/owners');
			return;
		}

		notice = 'Account created. Check your email to confirm your account, then return to your owner portal.';
	}
</script>

<section class="auth-shell">
	<div class="auth-card">
		<p class="eyebrow">Owner Sign Up</p>
		<h1>Create an account to submit your property listing.</h1>
		<p class="copy">
			This account is for landlords, agents, apartment owners, and developers who want to present a
			listing toward diaspora renters, returnees, and families.
		</p>

		{#if !data.supabaseConfigured}
			<p class="status error">Supabase auth is not configured yet. Add the public Supabase env vars first.</p>
		{:else}
			<form class="auth-form" onsubmit={handleSignup}>
				<label>
					<span>First Name</span>
					<input type="text" bind:value={firstName} autocomplete="given-name" />
				</label>
				<label>
					<span>Email</span>
					<input type="email" bind:value={email} autocomplete="email" required />
				</label>
				<label>
					<span>Password</span>
					<input type="password" bind:value={password} autocomplete="new-password" minlength="8" required />
				</label>

				{#if error}
					<p class="status error">{error}</p>
				{/if}

				{#if notice}
					<p class="status notice">{notice}</p>
				{/if}

				<Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
					{loading ? 'Creating Account...' : 'Create Account'}
				</Button>
			</form>

			<SupabaseOAuthButtons next={data.next} label="Or start with" />
		{/if}

		<p class="meta">
			Already signed up?
			<a href={`/login?next=${encodeURIComponent(data.next || '/housing/owners')}`}>Sign in</a>
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
			radial-gradient(circle at top right, rgba(3, 140, 37, 0.18), transparent 26rem),
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
		color: rgba(3, 140, 37, 0.82);
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

	.status.notice {
		color: #026b1d;
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
