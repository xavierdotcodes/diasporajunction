<script>
	let { data, form } = $props();
	let listing = $derived(data.dashboard?.listing ?? {});
	let featuredActive = $derived(listing.isFeatured && (!listing.featuredUntil || listing.featuredUntil > Date.now()));
	let featuredUntil = $derived(listing.featuredUntil ? new Date(listing.featuredUntil).toLocaleDateString() : '');
</script>

<main class="shell page">
	<header class="topline">
		<div>
			<h1>Upgrade {listing.businessName}</h1>
			<p class="muted">Paid upgrades improve visibility inside DiasporaJunxion. They do not guarantee customers, traffic, or ChatGPT placement.</p>
		</div>
		<a class="button secondary" href={`/dashboard/listings/${listing.id}`}>Back to dashboard</a>
	</header>

	{#if data.checkout === 'success'}
		<p class="notice">Stripe checkout returned successfully. Payment status is verified by webhook before your featured placement is activated.</p>
	{:else if data.checkout === 'cancel'}
		<p class="error">Checkout was cancelled. Your listing plan was not changed.</p>
	{/if}
	{#if form?.message}<p class="error">{form.message}</p>{/if}

	<section class="grid three">
		<div class="panel metric"><span>Current plan</span><strong>{listing.plan ?? 'BASIC'}</strong></div>
		<div class="panel metric"><span>Plan status</span><strong>{listing.planStatus ?? 'ACTIVE'}</strong></div>
		<div class="panel metric"><span>Featured</span><strong>{featuredActive ? 'Active' : 'Not active'}</strong></div>
	</section>

	<section class="grid two">
		<div class="panel">
			<h2>Featured Listing</h2>
			<p>Boosts placement within DiasporaJunxion surfaces for 30 days after webhook-confirmed payment.</p>
			<ul>
				<li>Featured sorting in public directory search.</li>
				<li>Featured badge on public listing cards and profile surfaces.</li>
				<li>Dashboard visibility for plan status and expiry.</li>
			</ul>
			{#if featuredActive}
				<p class="notice">Your listing is featured{featuredUntil ? ` until ${featuredUntil}` : ''}.</p>
			{:else}
				<form method="POST" action="?/feature">
					<button class="button" type="submit">Start featured checkout</button>
				</form>
			{/if}
		</div>
		<div class="panel">
			<h2>Founding Verified Listing</h2>
			<p>Your approved listing includes the founding verified profile tools: media, analytics, profile guidance, and AI-searchable discovery preparation.</p>
			<p class="muted">Future growth or subscription plans are not active yet. They will be introduced only after the simple one-time upgrade flow is stable.</p>
		</div>
	</section>
</main>

<style>
	.page { padding:3rem 0; display:grid; gap:1.25rem; }
	.topline { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
	.metric { display:grid; gap:.25rem; }
	.metric strong { font-size:1.5rem; font-weight:900; }
	.panel ul { margin:.25rem 0 1rem; padding-left:1.2rem; }
	.notice { color:#215f3a; }
	.error { color:#a33020; }
</style>
