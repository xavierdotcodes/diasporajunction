<script>
	let { data } = $props();
	const app = data.application;
	let uploadStatus = $state('');

	async function uploadFile(event, kind, type) {
		const file = event.currentTarget.files?.[0];
		if (!file) return;
		uploadStatus = `Uploading ${file.name}...`;
		const urlResponse = await fetch('/api/storage/upload-url', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ kind })
		});
		const { uploadUrl } = await urlResponse.json();
		const uploadResponse = await fetch(uploadUrl, {
			method: 'POST',
			headers: { 'content-type': file.type || 'application/octet-stream' },
			body: file
		});
		const { storageId } = await uploadResponse.json();
		const endpoint = kind === 'document' ? '/api/storage/verification-document' : '/api/storage/application-media';
		const saveResponse = await fetch(endpoint, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ applicationId: app._id, storageId, type })
		});
		uploadStatus = saveResponse.ok ? 'Upload saved. Refresh to see it in the list.' : 'Upload failed.';
	}
</script>

<main class="shell page">
	<h1>{app?.businessName ?? 'Application'}</h1>
	<p>Status: <strong>{app?.status}</strong></p>
	<p>Payment: <strong>{app?.paymentStatus}</strong></p>
	<a class="button" href={`/apply/${app?._id}/payment`}>Continue to payment</a>

	<section class="panel">
		<h2>Public media</h2>
		<p class="muted">Public media helps people trust and understand the listing.</p>
		<label>Logo/profile image <input type="file" accept="image/*" onchange={(event) => uploadFile(event, 'media', 'LOGO')} /></label>
		<label>Cover image <input type="file" accept="image/*" onchange={(event) => uploadFile(event, 'media', 'COVER')} /></label>
		<label>Gallery/portfolio image <input type="file" accept="image/*" onchange={(event) => uploadFile(event, 'media', 'GALLERY')} /></label>
		<div class="media-list">
			{#each data.media ?? [] as item}
				<a href={item.url} target="_blank" rel="noreferrer">{item.type} {item.caption ?? ''}</a>
			{/each}
		</div>
	</section>

	<section class="panel">
		<h2>Verification documents</h2>
		<p class="muted">Verification documents are admin-only and used for trust review.</p>
		<label>ID front <input type="file" onchange={(event) => uploadFile(event, 'document', 'ID_FRONT')} /></label>
		<label>ID back <input type="file" onchange={(event) => uploadFile(event, 'document', 'ID_BACK')} /></label>
		<label>Selfie with ID <input type="file" accept="image/*" onchange={(event) => uploadFile(event, 'document', 'SELFIE_WITH_ID')} /></label>
		<label>Business registration/proof <input type="file" onchange={(event) => uploadFile(event, 'document', 'BUSINESS_REGISTRATION')} /></label>
		<label>Other supporting doc <input type="file" onchange={(event) => uploadFile(event, 'document', 'OTHER')} /></label>
		<p>{uploadStatus}</p>
		<div class="media-list">
			{#each data.documents ?? [] as doc}
				<p>{doc.type}: {doc.status}</p>
			{/each}
		</div>
	</section>
</main>

<style>
	.page { padding: 3rem 0; display: grid; gap: 1rem; }
	label { display: grid; gap: .35rem; margin: .7rem 0; }
	.media-list { display: grid; gap: .45rem; margin-top: 1rem; }
</style>
