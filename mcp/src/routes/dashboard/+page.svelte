<script>
	let { data } = $props();
</script>

<main class="shell page">
	<header class="stack">
		<h1>Provider dashboard</h1>
		<p class="muted">Track listing visibility, leads, and profile quality.</p>
	</header>

	<section class="grid two">
		{#each data.listings ?? [] as listing}
			<a class="card listing-card" href={`/dashboard/listings/${listing.id}`}>
				<strong>{listing.businessName}</strong>
				<span>{listing.isActive ? 'Active' : 'Inactive'} · {listing.verificationStatus}</span>
				<span>Profile completeness: {listing.profileCompleteness?.score ?? 0}%</span>
				<span>30d interactions: {listing.interactionSummary30d?.total ?? 0}</span>
			</a>
		{/each}
	</section>
</main>

<style>
	.page { padding: 3rem 0; display: grid; gap: 1.5rem; }
	.stack { display: grid; gap: .35rem; }
	.listing-card { display: grid; gap: .45rem; text-decoration: none; }
</style>
