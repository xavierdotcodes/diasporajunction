<script>
	// @ts-nocheck
	let { data } = $props();
	let listing = $derived(data.dashboard?.listing ?? {});
	let completeness = $derived(data.dashboard?.profileCompleteness ?? {});
	let media = $derived(data.media ?? []);
	let status = $state('');
	let busy = $state(false);

	const logo = $derived(media.find((item) => item.type === 'LOGO'));
	const cover = $derived(media.find((item) => item.type === 'COVER'));
	const gallery = $derived(media.filter((item) => ['GALLERY', 'PORTFOLIO'].includes(item.type)));

	async function uploadFiles(event, type) {
		const files = Array.from(event.currentTarget.files ?? []);
		if (!files.length) return;
		busy = true;
		status = `Uploading ${files.length} file${files.length === 1 ? '' : 's'}...`;
		try {
			for (const [index, file] of files.entries()) {
				const uploadUrl = await createUploadUrl(type);
				const uploadResponse = await fetch(uploadUrl, {
					method: 'POST',
					headers: file.type ? { 'Content-Type': file.type } : {},
					body: file
				});
				if (!uploadResponse.ok) throw new Error('File upload failed.');
				const { storageId } = await uploadResponse.json();
				await saveMedia({
					type,
					storageId,
					caption: '',
					sortOrder: type === 'LOGO' || type === 'COVER' ? 0 : gallery.length + index + 1
				});
			}
			location.reload();
		} catch (error) {
			status = error instanceof Error ? error.message : 'Upload failed.';
		} finally {
			busy = false;
			event.currentTarget.value = '';
		}
	}

	async function createUploadUrl(type) {
		const response = await fetch('/api/storage/upload-url', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ kind: 'listing-media', listingId: listing.id, type })
		});
		const result = await response.json();
		if (!response.ok || !result.ok) throw new Error(result.message ?? 'Could not create upload URL.');
		return result.uploadUrl;
	}

	async function saveMedia(payload) {
		const response = await fetch('/api/storage/listing-media', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ listingId: listing.id, ...payload })
		});
		const result = await response.json();
		if (!response.ok || !result.ok) throw new Error(result.message ?? 'Could not save listing media.');
	}

	async function updateMedia(item, form) {
		busy = true;
		status = 'Saving media changes...';
		try {
			const response = await fetch('/api/storage/listing-media', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					mediaId: item.id,
					type: form.get('type'),
					caption: form.get('caption'),
					sortOrder: Number(form.get('sortOrder') ?? item.sortOrder ?? 0)
				})
			});
			const result = await response.json();
			if (!response.ok || !result.ok) throw new Error(result.message ?? 'Could not update media.');
			location.reload();
		} catch (error) {
			status = error instanceof Error ? error.message : 'Update failed.';
		} finally {
			busy = false;
		}
	}

	async function deleteMedia(item) {
		if (!confirm(`Delete this ${item.type.toLowerCase()} image?`)) return;
		busy = true;
		status = 'Deleting media...';
		try {
			const response = await fetch('/api/storage/listing-media', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ mediaId: item.id })
			});
			const result = await response.json();
			if (!response.ok || !result.ok) throw new Error(result.message ?? 'Could not delete media.');
			status = result.storageDeleted ? 'Media deleted.' : 'Media record deleted. Stored file cleanup may be unavailable.';
			location.reload();
		} catch (error) {
			status = error instanceof Error ? error.message : 'Delete failed.';
		} finally {
			busy = false;
		}
	}
</script>

<main class="shell page">
	<header class="topline">
		<div>
			<h1>Media for {listing.businessName}</h1>
			<p class="muted">Logo and cover help your listing look professional. Gallery photos help diaspora users trust your service.</p>
			<p class="muted">Verification documents are handled separately and are not shown publicly.</p>
		</div>
		<div class="actions">
			<a class="button secondary" href={`/dashboard/listings/${listing.id}`}>Dashboard</a>
			<a class="button secondary" href={listing.profileUrl}>Public profile</a>
		</div>
	</header>

	{#if status}<p class="notice">{status}</p>{/if}

	<section class="grid three">
		<div class="panel metric">
			<span>Completeness</span>
			<strong>{completeness.score ?? 0}%</strong>
		</div>
		<div class="panel metric">
			<span>Logo</span>
			<strong>{logo ? 'Added' : 'Missing'}</strong>
		</div>
		<div class="panel metric">
			<span>Gallery target</span>
			<strong>{Math.min(gallery.length, 3)}/3</strong>
		</div>
	</section>

	<section class="grid two">
		<div class="panel media-control">
			<h2>Logo</h2>
			{#if logo?.url}<img class="logo-preview" src={logo.url} alt={`${listing.businessName} logo`} />{/if}
			<label class="upload">Upload or replace logo <input disabled={busy} type="file" accept="image/*" onchange={(event) => uploadFiles(event, 'LOGO')} /></label>
		</div>
		<div class="panel media-control">
			<h2>Cover image</h2>
			{#if cover?.url}<img class="cover-preview" src={cover.url} alt={`${listing.businessName} cover`} />{/if}
			<label class="upload">Upload or replace cover <input disabled={busy} type="file" accept="image/*" onchange={(event) => uploadFiles(event, 'COVER')} /></label>
		</div>
	</section>

	<section class="panel media-control">
		<div class="topline">
			<div>
				<h2>Gallery and portfolio</h2>
				<p class="muted">At least three gallery or portfolio images count toward profile completeness.</p>
			</div>
			<label class="button file-button">
				Add images
				<input disabled={busy} type="file" accept="image/*" multiple onchange={(event) => uploadFiles(event, 'GALLERY')} />
			</label>
		</div>
		<div class="media-grid">
			{#each media as item}
				<article class="media-item">
					{#if item.url}<img src={item.url} alt={item.caption ?? `${listing.businessName} ${item.type}`} />{/if}
					<form
						onsubmit={(event) => {
							event.preventDefault();
							updateMedia(item, new FormData(event.currentTarget));
						}}
					>
						<label>Type
							<select name="type" value={item.type}>
								<option value="LOGO">Logo</option>
								<option value="COVER">Cover</option>
								<option value="GALLERY">Gallery</option>
								<option value="PORTFOLIO">Portfolio</option>
							</select>
						</label>
						<label>Caption <input name="caption" value={item.caption ?? ''} maxlength="240" /></label>
						<label>Order <input name="sortOrder" type="number" min="0" step="1" value={item.sortOrder ?? 0} /></label>
						<div class="actions">
							<button class="button secondary" disabled={busy} type="submit">Save</button>
							<button class="button danger" disabled={busy} type="button" onclick={() => deleteMedia(item)}>Delete</button>
						</div>
					</form>
				</article>
			{/each}
		</div>
	</section>
</main>

<style>
	.page { padding: 3rem 0; display:grid; gap:1.25rem; }
	.topline { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
	.actions { display:flex; gap:.6rem; flex-wrap:wrap; align-items:center; }
	.metric { display:grid; gap:.25rem; }
	.metric strong { font-size:1.8rem; font-weight:900; }
	.media-control { display:grid; gap:1rem; }
	.logo-preview { width:112px; height:112px; object-fit:cover; border-radius:.5rem; border:1px solid #d8d3c8; }
	.cover-preview { width:100%; max-height:240px; object-fit:cover; border-radius:.5rem; border:1px solid #d8d3c8; }
	.upload { display:grid; gap:.35rem; font-weight:700; }
	.file-button { position:relative; overflow:hidden; cursor:pointer; }
	.file-button input { position:absolute; inset:0; opacity:0; cursor:pointer; }
	.media-grid { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
	.media-item { display:grid; gap:.75rem; border:1px solid #d8d3c8; border-radius:.5rem; padding:.75rem; background:#fff; }
	.media-item img { width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:.4rem; border:1px solid #d8d3c8; }
	form, label { display:grid; gap:.4rem; }
	input, select { width:100%; padding:.65rem; border:1px solid #d8d3c8; border-radius:.4rem; font:inherit; }
	.notice { color:#215f3a; }
	.danger { background:#7f1d1d; border-color:#7f1d1d; }
</style>
