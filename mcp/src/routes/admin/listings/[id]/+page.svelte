<script>
	// @ts-nocheck
	let { data } = $props();
	let listing = $derived(data.listing);
	let media = $derived(data.media ?? []);
	let hasLogo = $derived(media.some((item) => item.type === 'LOGO'));
	let hasCover = $derived(media.some((item) => item.type === 'COVER'));
	let galleryCount = $derived(media.filter((item) => ['GALLERY', 'PORTFOLIO'].includes(item.type)).length);
</script>

<main class="shell page">
	<h1>{listing?.businessName}</h1>
	<section class="panel">
		<p>Status: {listing?.isActive ? 'Active' : 'Inactive'}</p>
		<p>Plan: {listing?.plan ?? 'BASIC'} · {listing?.planStatus ?? 'ACTIVE'}</p>
		<p>Featured: {listing?.isFeatured ? 'Yes' : 'No'}</p>
		{#if listing?.featuredUntil}<p>Featured until: {new Date(listing.featuredUntil).toLocaleDateString()}</p>{/if}
		{#if listing?.lastUpgradeAt}<p>Last upgrade: {new Date(listing.lastUpgradeAt).toLocaleDateString()}</p>{/if}
		{#if listing?.upgradeSourcePaymentId}<p>Upgrade payment: {listing.upgradeSourcePaymentId}</p>{/if}
		<p>Verification: {listing?.verificationStatus}</p>
		<p>Profile completeness: {data.profileCompleteness?.score ?? 0}%</p>
		<p>Media: logo {hasLogo ? 'added' : 'missing'} · cover {hasCover ? 'added' : 'missing'} · gallery {galleryCount}/3</p>
		<p>{listing?.description}</p>
	</section>
	<section class="panel">
		<h2>Public media</h2>
		<p class="muted">Use this to identify missing logo, cover, or gallery assets.</p>
		<div class="preview-grid">
			{#each data.media ?? [] as item}
				<a href={item.url} target="_blank" rel="noreferrer">
					{#if item.url}<img src={item.url} alt={`${item.type} preview`} />{/if}
					<span>{item.type}</span>
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	.page { padding: 3rem 0; display:grid; gap:1rem; }
	.preview-grid { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); }
	img { max-width:100%; border-radius:.5rem; border:1px solid #d8d3c8; }
</style>
