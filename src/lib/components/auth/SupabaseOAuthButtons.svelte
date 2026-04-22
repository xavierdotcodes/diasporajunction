<script>
	import { env } from '$env/dynamic/public';
	import { getSupabaseBrowserClient } from '$lib/supabase/client';

	let { next = '/housing/owners', label = 'Continue with' } = $props();
	let oauthError = $state('');
	let loadingProvider = $state('');
	const enabledProviders = [
		env.PUBLIC_SUPABASE_ENABLE_GOOGLE_AUTH === '1' ? 'google' : null,
		env.PUBLIC_SUPABASE_ENABLE_FACEBOOK_AUTH === '1' ? 'facebook' : null
	].filter(Boolean);

	async function signInWithProvider(provider) {
		oauthError = '';
		const supabase = getSupabaseBrowserClient();

		if (!supabase) {
			oauthError = 'Supabase auth is not configured yet.';
			return;
		}

		loadingProvider = provider;

		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
			}
		});

		loadingProvider = '';

		if (error) {
			oauthError = error.message;
		}
	}
</script>

{#if enabledProviders.length > 0}
	<div class="oauth">
		<p class="oauth-label">{label}</p>

		<div class="oauth-grid">
			{#each enabledProviders as provider}
				<button type="button" onclick={() => signInWithProvider(provider)} disabled={loadingProvider !== ''}>
					{loadingProvider === provider ? 'Redirecting...' : provider[0].toUpperCase() + provider.slice(1)}
				</button>
			{/each}
		</div>

		{#if oauthError}
			<p class="oauth-error">{oauthError}</p>
		{/if}
	</div>
{/if}

<style>
	.oauth {
		display: grid;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.oauth-label {
		margin: 0;
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(17, 17, 17, 0.52);
	}

	.oauth-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	button {
		min-height: 3rem;
		border-radius: 999px;
		border: 1px solid rgba(17, 17, 17, 0.12);
		background: #fff;
		font-weight: 700;
	}

	.oauth-error {
		margin: 0;
		color: #b10323;
		font-size: 0.92rem;
	}
</style>
