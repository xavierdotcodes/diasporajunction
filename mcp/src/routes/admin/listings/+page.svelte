<script>
	let { data } = $props();
</script>

<main class="shell page">
	<h1>Listings</h1>
	<h2>Featured</h2>
	{#each data.featured as listing}
		<a class="card row" href={`/admin/listings/${listing._id}`}>{listing.businessName}</a>
	{/each}
	<h2>Inactive</h2>
	{#each data.inactive as listing}
		<a class="card row" href={`/admin/listings/${listing._id}`}>{listing.businessName}</a>
	{/each}
	<h2>Missing media</h2>
	{#each data.missingMedia as listing}
		<a class="card row" href={`/admin/listings/${listing._id}`}>{listing.businessName}</a>
	{/each}
</main>

<style>.page { padding: 3rem 0; }.row { display:block; margin:.5rem 0; text-decoration:none; }</style>
