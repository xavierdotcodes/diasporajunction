<script>
	let { data, form } = $props();
	let listing = $derived(data.dashboard?.listing ?? {});
</script>

<main class="shell page">
	<header>
		<h1>Edit {listing.businessName}</h1>
		<p class="muted">Only public profile fields can be edited here.</p>
	</header>

	{#if form?.message}<p class={form.ok ? 'success' : 'error'}>{form.message}</p>{/if}

	<form method="POST" class="panel form">
		<label>Short description <input name="shortDescription" value={listing.shortDescription ?? ''} /></label>
		<label>Description <textarea name="description" rows="6">{listing.description ?? ''}</textarea></label>
		<label>Services offered <input name="servicesOffered" value={(listing.servicesOffered ?? []).join(', ')} /></label>
		<label>Keywords <input name="keywords" value={(listing.keywords ?? []).join(', ')} /></label>
		<label>Phone <input name="phone" value={listing.phone ?? ''} /></label>
		<label>WhatsApp <input name="whatsapp" value={listing.whatsapp ?? ''} /></label>
		<label>Email <input name="email" type="email" value={listing.email ?? ''} /></label>
		<label>Website <input name="website" value={listing.website ?? ''} /></label>
		<label>Service area <input name="serviceArea" value={listing.serviceArea ?? ''} /></label>
		<label>Languages <input name="languages" value={(listing.languages ?? []).join(', ')} /></label>
		<label>Price range <input name="priceRange" value={listing.priceRange ?? ''} /></label>
		<div class="checks">
			<label><input type="checkbox" name="remoteAvailable" checked={listing.remoteAvailable} /> Remote available</label>
			<label><input type="checkbox" name="inPersonAvailable" checked={listing.inPersonAvailable} /> In-person available</label>
			<label><input type="checkbox" name="whatsappAvailable" checked={listing.whatsappAvailable} /> WhatsApp available</label>
		</div>
		<div class="actions">
			<button class="button" type="submit">Save public profile</button>
			<a class="button secondary" href={`/dashboard/listings/${listing.id}/media`}>Manage media</a>
			<a class="button secondary" href={`/dashboard/listings/${listing.id}`}>Back</a>
		</div>
	</form>
</main>

<style>
	.page { padding: 3rem 0; display:grid; gap:1rem; }
	.form { display:grid; gap:1rem; }
	label { display:grid; gap:.35rem; font-weight:700; }
	input, textarea { width:100%; padding:.7rem; border:1px solid #d8d3c8; border-radius:.4rem; font:inherit; }
	.checks, .actions { display:flex; flex-wrap:wrap; gap:.75rem; }
	.checks label { display:flex; align-items:center; gap:.4rem; font-weight:600; }
	.success { color:#215f3a; }
	.error { color:#a33020; }
</style>
