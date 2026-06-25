<script>
	function throwTestError() {
		throw new Error('Sentry example error from DiasporaJunxion');
	}
</script>

<svelte:head>
	<title>Sentry Example | DiasporaJunxion</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="sentry-example">
	<section>
		<p class="eyebrow">Sentry verification</p>
		<h1>Trigger a test error</h1>
		<p>
			Use this page after deployment to confirm browser errors are reaching the
			DiasporaJunxion Sentry project.
		</p>
		<button type="button" onclick={throwTestError}>Trigger test error</button>
	</section>
</main>

<style>
	.sentry-example {
		display: grid;
		min-height: 100vh;
		place-items: center;
		padding: 2rem;
		background: #f8f6f1;
		color: #111111;
	}

	section {
		width: min(100%, 42rem);
		border: 1px solid #e7e1d3;
		border-radius: 0.75rem;
		padding: clamp(2rem, 5vw, 3.5rem);
		background: #ffffff;
		box-shadow: 0 24px 70px rgba(0, 0, 0, 0.08);
	}

	.eyebrow {
		margin: 0 0 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #c98e00;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 6vw, 3.75rem);
		line-height: 0.95;
	}

	p:not(.eyebrow) {
		margin: 1.25rem 0 0;
		color: #5f5f5f;
		font-size: 1.05rem;
		line-height: 1.7;
	}

	button {
		margin-top: 2rem;
		border: 0;
		border-radius: 999px;
		padding: 0.95rem 1.35rem;
		background: #038c25;
		color: #ffffff;
		font-weight: 800;
		cursor: pointer;
	}

	button:hover {
		background: #026b1d;
	}
</style>
