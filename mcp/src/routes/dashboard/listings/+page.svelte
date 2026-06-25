<script>
	let { data } = $props();
</script>

<main class="shell page">
	<header class="topline">
		<h1>Your listings</h1>
		<a class="button secondary" href="/apply">Add listing</a>
	</header>

	<div class="grid two">
		{#each data.listings ?? [] as listing}
			<section class="card">
				<h2>{listing.businessName}</h2>
				<p>{listing.shortDescription}</p>
				<p class="muted">{listing.category} · {listing.city}, {listing.region}</p>
				<div class="stats">
					<span>{listing.profileCompleteness?.score ?? 0}% complete</span>
					<span>{listing.interactionSummary7d?.total ?? 0} interactions in 7d</span>
					<span>{listing.interactionSummary30d?.total ?? 0} interactions in 30d</span>
				</div>
				<div class="actions">
					<a class="button" href={`/dashboard/listings/${listing.id}`}>Dashboard</a>
					<a class="button secondary" href={listing.profileUrl}>Public profile</a>
				</div>
			</section>
		{/each}
	</div>
</main>

<style>
	.page { padding: 3rem 0; display: grid; gap: 1.5rem; }
	.topline { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
	.stats, .actions { display:flex; flex-wrap:wrap; gap:.6rem; }
	.stats span { border:1px solid #d8d3c8; border-radius:.4rem; padding:.35rem .55rem; background:#fff; }
</style>
