<script>
	let { data, form } = $props();
</script>

<main class="shell page">
	<h1>Application payment</h1>
	<p>Pay the listing application fee for <strong>{data.application?.businessName}</strong>.</p>
	<p class="muted">Stripe verifies the payment by webhook. This page never marks payment success directly.</p>
	{#if form?.message}<p class="error">{form.message}</p>{/if}
	<form method="POST">
		<button class="button" type="submit">Continue to Stripe Checkout</button>
	</form>
</main>

<style>.page { padding: 3rem 0; }.error { color: #a33020; }</style>
