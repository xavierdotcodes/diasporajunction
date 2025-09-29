<script>
	import { invalidate } from '$app/navigation';
	export let data;

	let password = '';
	let error = false;

	async function login(event) {
		event.preventDefault();

		const form = new FormData();
		form.append('password', password);

		const res = await fetch('?/', {
			method: 'POST',
			body: form
		});

		if (res.status === 401) {
			error = true;
		} else {
			await invalidate();
		}
	}
</script>

{#if data.loggedIn}
	<div class="portal-welcome">
		<h1>Welcome to NDGO Portal</h1>
		<p>Access your teacher and student resources here.</p>
	</div>
{:else}
	<div class="login-wrapper">
		<div class="login-card">
			<h2>NDGO Portal Login</h2>
			{#if error}
				<p class="error-text">Incorrect password</p>
			{/if}
			<form on:submit={login} class="login-form">
				<input type="password" bind:value={password} placeholder="Enter your password" required />
				<button type="submit">Log In</button>
			</form>
		</div>
	</div>
{/if}

<style>
	/* Fullscreen background */
	.login-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #1f1f2e, #2b2b3d);
		padding: 1rem;
	}

	/* Card container */
	.login-card {
		background: #272736;
		padding: 3rem 2rem;
		border-radius: 1rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		width: 100%;
		max-width: 400px;
		text-align: center;
		color: #fff;
	}

	h2 {
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: #ffc600;
	}

	/* Form elements */
	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	input {
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		border: none;
		outline: none;
		background: #1f1f2e;
		color: #fff;
		font-size: 1rem;
		transition: all 0.2s ease;
	}

	input:focus {
		box-shadow: 0 0 0 2px #ffc600;
		background: #252535;
	}

	button {
		padding: 0.75rem;
		border-radius: 0.5rem;
		border: none;
		background: #ffc600;
		color: #1f1f2e;
		font-weight: bold;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s ease;
	}

	button:hover {
		background: #e5b500;
		transform: translateY(-2px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
	}

	.error-text {
		color: #ff4d4f;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.portal-welcome {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		color: #ffc600;
		background: linear-gradient(135deg, #1f1f2e, #2b2b3d);
		text-align: center;
	}

	.portal-welcome h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.portal-welcome p {
		font-size: 1.25rem;
		color: #fff;
	}
</style>
