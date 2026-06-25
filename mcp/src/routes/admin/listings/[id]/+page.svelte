<script>
	let { data } = $props();
	const listing = data.listing;
</script>

<main class="shell page">
	<h1>{listing?.businessName}</h1>
	<section class="panel">
		<p>Status: {listing?.isActive ? 'Active' : 'Inactive'}</p>
		<p>Featured: {listing?.isFeatured ? 'Yes' : 'No'}</p>
		<p>Verification: {listing?.verificationStatus}</p>
		<p>Profile completeness: {data.profileCompleteness?.score ?? 0}%</p>
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
