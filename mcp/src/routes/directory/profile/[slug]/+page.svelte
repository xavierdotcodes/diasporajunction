<script>
	let { data, form } = $props();
	const listing = data.listing;
</script>

<main class="shell page">
	{#if listing}
		{#if listing.coverUrl}
			<img class="cover" src={listing.coverUrl} alt={`${listing.businessName} cover`} />
		{/if}
		<h1>{listing.businessName}</h1>
		{#if listing.logoUrl}
			<img class="logo" src={listing.logoUrl} alt={`${listing.businessName} logo`} />
		{/if}
		<p class="badge">{listing.verificationStatus}</p>
		<p>{listing.shortDescription}</p>
		<p>{listing.description}</p>
		<p>{listing.city}, {listing.region}, {listing.country}</p>
		<p>Service area: {listing.serviceArea}</p>
		{#if form?.message}<p class="error">{form.message}</p>{/if}
		<div class="grid two">
			{#if listing.contactOptions?.whatsapp?.available}
				<form method="POST" action="?/contact">
					<input type="hidden" name="listingId" value={listing.id} />
					<input type="hidden" name="type" value="WHATSAPP_CLICK" />
					<button class="button" type="submit">WhatsApp</button>
				</form>
			{/if}
			{#if listing.contactOptions?.phone?.available}
				<form method="POST" action="?/contact">
					<input type="hidden" name="listingId" value={listing.id} />
					<input type="hidden" name="type" value="PHONE_CLICK" />
					<button class="button secondary" type="submit">Phone</button>
				</form>
			{/if}
			{#if listing.contactOptions?.email?.available}
				<form method="POST" action="?/contact">
					<input type="hidden" name="listingId" value={listing.id} />
					<input type="hidden" name="type" value="EMAIL_CLICK" />
					<button class="button secondary" type="submit">Email</button>
				</form>
			{/if}
			{#if listing.contactOptions?.website?.available}
				<form method="POST" action="?/contact">
					<input type="hidden" name="listingId" value={listing.id} />
					<input type="hidden" name="type" value="WEBSITE_CLICK" />
					<button class="button secondary" type="submit">Website</button>
				</form>
			{/if}
		</div>
		{#if listing.gallery?.length}
			<section>
				<h2>Gallery</h2>
				<div class="gallery">
					{#each listing.gallery as item}
						<a href={item.url} target="_blank" rel="noreferrer">
							<img src={item.url} alt={item.caption ?? `${listing.businessName} media`} />
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{:else}
		<h1>Listing not found</h1>
	{/if}
</main>

<style>
	.page { padding: 3rem 0; display:grid; gap:1rem; }
	.error { color: #a33020; }
	.cover { width:100%; max-height:340px; object-fit:cover; border-radius:.5rem; border:1px solid #d8d3c8; }
	.logo { width:96px; height:96px; object-fit:cover; border-radius:.5rem; border:1px solid #d8d3c8; }
	.gallery { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); }
	.gallery img { width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:.5rem; border:1px solid #d8d3c8; }
</style>
